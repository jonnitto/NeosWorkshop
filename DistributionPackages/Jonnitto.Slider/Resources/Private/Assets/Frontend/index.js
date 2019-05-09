import Flickity from './FlickityExtended';

const AUTOPLAY_CLASS = 'slider--autoplay';
const INIT_CLASS = 'slider--init';

// Remove autoplay class on stop
Flickity.prototype.stopPlayer = function() {
    this.player.stop();
    this.element.classList.remove(AUTOPLAY_CLASS);
};

const STRINGS = document.body.dataset.slider.split(',');

// Set additional default values
const DEFAULTS = {
    pauseAutoPlayOnHover: false,
    imagesLoaded: true,
    pageDotAriaLabel: STRINGS[0],
    previousAriaLabel: STRINGS[1],
    nextAriaLabel: STRINGS[2],
    on: {
        ready: function() {
            if (this.options.autoPlay) {
                this.element.classList.add(AUTOPLAY_CLASS);
                setTimeout(() => {
                    this.element.classList.add(INIT_CLASS);
                }, 10);
            }
        }
    }
};

Object.assign(Flickity.defaults, DEFAULTS);

// Add localized labels with this duck-punch code
// https://metafizzy.co/blog/duck-punching-prototype/

let addDots = Flickity.PageDots.prototype.addDots;
Flickity.PageDots.prototype.addDots = function() {
    addDots.apply(this, arguments);
    let ariaLabel = this.parent.options.pageDotAriaLabel;
    this.dots.forEach(function(dot, i) {
        let label = ariaLabel.replace('%n', i + 1);
        dot.setAttribute('aria-label', label);
    });
};

let _createButton = Flickity.PrevNextButton.prototype._create;
Flickity.PrevNextButton.prototype._create = function() {
    _createButton.apply(this, arguments);
    let optionName = this.isPrevious ? 'previous' : 'next';
    let label = this.parent.options[optionName + 'AriaLabel'];
    this.element.setAttribute('aria-label', label);
};

// Enable buttons only if there are more than one slide
let _createPrevNextButtons = Flickity.prototype._createPrevNextButtons;
Flickity.prototype._createPrevNextButtons = function() {
    if (this.element.childNodes.length <= 1) {
        return;
    }
    _createPrevNextButtons.apply(this, arguments);
};

export default Flickity;
