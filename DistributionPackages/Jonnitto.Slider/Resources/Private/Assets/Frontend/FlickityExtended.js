import Flickity from 'flickity';
import imagesLoaded from 'imagesloaded';
import utils from 'fizzy-ui-utils';

let proto = Flickity.prototype;

// -------------------------- sync prototype --------------------------
// Flickity.defaults.sync = false;

Flickity.createMethods.push('_createSync');

proto._createSync = function() {
    this.syncers = {};
    let syncOption = this.options.sync;

    this.on('destroy', this.unsyncAll);

    if (!syncOption) {
        return;
    }
    // HACK do async, give time for other flickity to be initalized
    let _this = this;
    setTimeout(function initSyncCompanion() {
        _this.sync(syncOption);
    });
};

/**
 * sync
 * @param {Element} or {String} elem
 */
proto.sync = function(elem) {
    elem = utils.getQueryElement(elem);
    let companion = Flickity.data(elem);
    if (!companion) {
        return;
    }
    // two hearts, that beat as one
    this._syncCompanion(companion);
    companion._syncCompanion(this);
};

/**
 * @param {Flickity} companion
 */
proto._syncCompanion = function(companion) {
    let _this = this;
    function syncListener() {
        let index = _this.selectedIndex;
        // do not select if already selected, prevent infinite loop
        if (companion.selectedIndex != index) {
            companion.select(index);
        }
    }
    this.on('select', syncListener);
    // keep track of all synced flickities
    // hold on to listener to unsync
    this.syncers[companion.guid] = {
        flickity: companion,
        listener: syncListener
    };
};

/**
 * unsync
 * @param {Element} or {String} elem
 */
proto.unsync = function(elem) {
    elem = utils.getQueryElement(elem);
    let companion = Flickity.data(elem);
    this._unsync(companion);
};

/**
 * @param {Flickity} companion
 */
proto._unsync = function(companion) {
    if (!companion) {
        return;
    }
    // I love you but I've chosen darkness
    this._unsyncCompanion(companion);
    companion._unsyncCompanion(this);
};

/**
 * @param {Flickity} companion
 */
proto._unsyncCompanion = function(companion) {
    let id = companion.guid;
    let syncer = this.syncers[id];
    this.off('select', syncer.listener);
    delete this.syncers[id];
};

proto.unsyncAll = function() {
    for (let id in this.syncers) {
        let syncer = this.syncers[id];
        this._unsync(syncer.flickity);
    }
};

/*
 * Flickity asNavFor v2.0.1
 * enable asNavFor for Flickity
 */

Flickity.createMethods.push('_createAsNavFor');

proto._createAsNavFor = function() {
    this.on('activate', this.activateAsNavFor);
    this.on('deactivate', this.deactivateAsNavFor);
    this.on('destroy', this.destroyAsNavFor);

    let asNavForOption = this.options.asNavFor;
    if (!asNavForOption) {
        return;
    }
    // HACK do async, give time for other flickity to be initalized
    let _this = this;
    setTimeout(function initNavCompanion() {
        _this.setNavCompanion(asNavForOption);
    });
};

proto.setNavCompanion = function(elem) {
    elem = utils.getQueryElement(elem);
    let companion = Flickity.data(elem);
    // stop if no companion or companion is self
    if (!companion || companion == this) {
        return;
    }

    this.navCompanion = companion;
    // companion select
    let _this = this;
    this.onNavCompanionSelect = function() {
        _this.navCompanionSelect();
    };
    companion.on('select', this.onNavCompanionSelect);
    // click
    this.on('staticClick', this.onNavStaticClick);

    this.navCompanionSelect(true);
};

proto.navCompanionSelect = function(isInstant) {
    if (!this.navCompanion) {
        return;
    }
    // select slide that matches first cell of slide
    let selectedCell = this.navCompanion.selectedCells[0];
    let firstIndex = this.navCompanion.cells.indexOf(selectedCell);
    let lastIndex = firstIndex + this.navCompanion.selectedCells.length - 1;
    let selectIndex = Math.floor(lerp(firstIndex, lastIndex, this.navCompanion.cellAlign));
    this.selectCell(selectIndex, false, isInstant);
    // set nav selected class
    this.removeNavSelectedElements();
    // stop if companion has more cells than this one
    if (selectIndex >= this.cells.length) {
        return;
    }

    let selectedCells = this.cells.slice(firstIndex, lastIndex + 1);
    this.navSelectedElements = selectedCells.map(function(cell) {
        return cell.element;
    });
    this.changeNavSelectedClass('add');
};

function lerp(a, b, t) {
    return (b - a) * t + a;
}

proto.changeNavSelectedClass = function(method) {
    this.navSelectedElements.forEach(function(navElem) {
        navElem.classList[method]('is-nav-selected');
    });
};

proto.activateAsNavFor = function() {
    this.navCompanionSelect(true);
};

proto.removeNavSelectedElements = function() {
    if (!this.navSelectedElements) {
        return;
    }
    this.changeNavSelectedClass('remove');
    delete this.navSelectedElements;
};

proto.onNavStaticClick = function(event, pointer, cellElement, cellIndex) {
    if (typeof cellIndex == 'number') {
        this.navCompanion.selectCell(cellIndex);
    }
};

proto.deactivateAsNavFor = function() {
    this.removeNavSelectedElements();
};

proto.destroyAsNavFor = function() {
    if (!this.navCompanion) {
        return;
    }
    this.navCompanion.off('select', this.onNavCompanionSelect);
    this.off('staticClick', this.onNavStaticClick);
    delete this.navCompanion;
};

/*
 * Flickity imagesLoaded v2.0.0
 * enables imagesLoaded option for Flickity
 */

Flickity.createMethods.push('_createImagesLoaded');

proto._createImagesLoaded = function() {
    this.on('activate', this.imagesLoaded);
};

proto.imagesLoaded = function() {
    if (!this.options.imagesLoaded) {
        return;
    }
    let _this = this;
    function onImagesLoadedProgress(instance, image) {
        let cell = _this.getParentCell(image.img);
        _this.cellSizeChange(cell && cell.element);
        if (!_this.options.freeScroll) {
            _this.positionSliderAtSelected();
        }
    }
    imagesLoaded(this.slider).on('progress', onImagesLoadedProgress);
};

// ---- Slide ---- //

let Slide = Flickity.Slide;
let slideUpdateTarget = Slide.prototype.updateTarget;
Slide.prototype.updateTarget = function() {
    slideUpdateTarget.apply(this, arguments);
    if (!this.parent.options.fade) {
        return;
    }
    // position cells at selected target
    let slideTargetX = this.target - this.x;
    let firstCellX = this.cells[0].x;
    this.cells.forEach(function(cell) {
        let targetX = cell.x - firstCellX - slideTargetX;
        cell.renderPosition(targetX);
    });
};

Slide.prototype.setOpacity = function(alpha) {
    this.cells.forEach(function(cell) {
        cell.element.style.opacity = alpha;
    });
};

// ---- Flickity ---- //

Flickity.createMethods.push('_createFade');

proto._createFade = function() {
    this.fadeIndex = this.selectedIndex;
    this.prevSelectedIndex = this.selectedIndex;
    this.on('select', this.onSelectFade);
    this.on('dragEnd', this.onDragEndFade);
    this.on('settle', this.onSettleFade);
    this.on('activate', this.onActivateFade);
    this.on('deactivate', this.onDeactivateFade);
};

let updateSlides = proto.updateSlides;
proto.updateSlides = function() {
    updateSlides.apply(this, arguments);
    if (!this.options.fade) {
        return;
    }
    // set initial opacity
    this.slides.forEach(function(slide, i) {
        let alpha = i == this.selectedIndex ? 1 : 0;
        slide.setOpacity(alpha);
    }, this);
};

// ---- events ---- //

proto.onSelectFade = function() {
    // in case of resize, keep fadeIndex within current count
    this.fadeIndex = Math.min(this.prevSelectedIndex, this.slides.length - 1);
    this.prevSelectedIndex = this.selectedIndex;
};

proto.onSettleFade = function() {
    delete this.didDragEnd;
    if (!this.options.fade) {
        return;
    }
    // set full and 0 opacity on selected & faded slides
    this.selectedSlide.setOpacity(1);
    let fadedSlide = this.slides[this.fadeIndex];
    if (fadedSlide && this.fadeIndex != this.selectedIndex) {
        this.slides[this.fadeIndex].setOpacity(0);
    }
};

proto.onDragEndFade = function() {
    // set flag
    this.didDragEnd = true;
};

proto.onActivateFade = function() {
    if (this.options.fade) {
        this.element.classList.add('is-fade');
    }
};

proto.onDeactivateFade = function() {
    if (!this.options.fade) {
        return;
    }
    this.element.classList.remove('is-fade');
    // reset opacity
    this.slides.forEach(function(slide) {
        slide.setOpacity('');
    });
};

// ---- position & fading ---- //

let positionSlider = proto.positionSlider;
proto.positionSlider = function() {
    if (!this.options.fade) {
        positionSlider.apply(this, arguments);
        return;
    }

    this.fadeSlides();
    this.dispatchScrollEvent();
};

let positionSliderAtSelected = proto.positionSliderAtSelected;
proto.positionSliderAtSelected = function() {
    if (this.options.fade) {
        // position fade slider at origin
        this.setTranslateX(0);
    }
    positionSliderAtSelected.apply(this, arguments);
};

proto.fadeSlides = function() {
    if (this.slides.length < 2) {
        return;
    }
    // get slides to fade-in & fade-out
    let indexes = this.getFadeIndexes();
    let fadeSlideA = this.slides[indexes.a];
    let fadeSlideB = this.slides[indexes.b];
    let distance = this.wrapDifference(fadeSlideA.target, fadeSlideB.target);
    let progress = this.wrapDifference(fadeSlideA.target, -this.x);
    progress = progress / distance;

    fadeSlideA.setOpacity(1 - progress);
    fadeSlideB.setOpacity(progress);

    // hide previous slide
    let fadeHideIndex = indexes.a;
    if (this.isDragging) {
        fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
    }
    let isNewHideIndex =
        this.fadeHideIndex != undefined &&
        this.fadeHideIndex != fadeHideIndex &&
        this.fadeHideIndex != indexes.a &&
        this.fadeHideIndex != indexes.b;
    if (isNewHideIndex) {
        // new fadeHideSlide set, hide previous
        this.slides[this.fadeHideIndex].setOpacity(0);
    }
    this.fadeHideIndex = fadeHideIndex;
};

proto.getFadeIndexes = function() {
    if (!this.isDragging && !this.didDragEnd) {
        return {
            a: this.fadeIndex,
            b: this.selectedIndex
        };
    }
    if (this.options.wrapAround) {
        return this.getFadeDragWrapIndexes();
    } else {
        return this.getFadeDragLimitIndexes();
    }
};

proto.getFadeDragWrapIndexes = function() {
    let distances = this.slides.map(function(slide, i) {
        return this.getSlideDistance(-this.x, i);
    }, this);
    let absDistances = distances.map(function(distance) {
        return Math.abs(distance);
    });
    let minDistance = Math.min.apply(Math, absDistances);
    let closestIndex = absDistances.indexOf(minDistance);
    let distance = distances[closestIndex];
    let len = this.slides.length;

    let delta = distance >= 0 ? 1 : -1;
    return {
        a: closestIndex,
        b: utils.modulo(closestIndex + delta, len)
    };
};

proto.getFadeDragLimitIndexes = function() {
    // calculate closest previous slide
    let dragIndex = 0;
    for (let i = 0; i < this.slides.length - 1; i++) {
        let slide = this.slides[i];
        if (-this.x < slide.target) {
            break;
        }
        dragIndex = i;
    }
    return {
        a: dragIndex,
        b: dragIndex + 1
    };
};

proto.wrapDifference = function(a, b) {
    let diff = b - a;

    if (!this.options.wrapAround) {
        return diff;
    }

    let diffPlus = diff + this.slideableWidth;
    let diffMinus = diff - this.slideableWidth;
    if (Math.abs(diffPlus) < Math.abs(diff)) {
        diff = diffPlus;
    }
    if (Math.abs(diffMinus) < Math.abs(diff)) {
        diff = diffMinus;
    }
    return diff;
};

// ---- wrapAround ---- //

let _getWrapShiftCells = proto._getWrapShiftCells;
proto._getWrapShiftCells = function() {
    if (!this.options.fade) {
        _getWrapShiftCells.apply(this, arguments);
    }
};

let shiftWrapCells = proto.shiftWrapCells;
proto.shiftWrapCells = function() {
    if (!this.options.fade) {
        shiftWrapCells.apply(this, arguments);
    }
};

export default Flickity;
