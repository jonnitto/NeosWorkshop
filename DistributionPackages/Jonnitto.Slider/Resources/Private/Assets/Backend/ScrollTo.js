import Gator from 'gator';
import { checkNodeType } from './Node';

// Add here your slider item content elements in an array. e.g. like this:
// 'Jonnitto.Theme:Slider.Teaser.Item'
// All these elements need to have data-index={iterator.index} to be set
const NODE_TYPES = [];

function getSlider(element) {
    let selector = '.slider';
    let find = element.parentElement.querySelector(selector);
    if (!find) {
        find = element.parentElement.parentElement.querySelector(selector);
    }
    return find ? find : element.closest(selector);
}

function scrollToSlide(element) {
    let index = element.dataset.index;
    let slider = getSlider(element);
    if (slider && typeof index != 'undefined') {
        slider.scrollTo(slider.clientWidth * parseInt(index), 0);
    }
}

Gator(document).on('click', '.flickity-prev-next-button', function() {
    let slider = getSlider(this);
    if (!slider) {
        return;
    }
    let wrapper = slider.parentElement;
    let modifier = this.classList.contains('next') ? 1 : -1;
    slider.scrollBy(wrapper.clientWidth * modifier, 0);
});

Gator(document).on('click', '.flickity-page-dots .dot', function() {
    scrollToSlide(this);
});

let counter = 0;
let intervalID = null;

Gator(document).on('Neos.NodeSelected', event => {
    const DETAIL = event.detail;

    if (checkNodeType(DETAIL.node, NODE_TYPES)) {
        // Revert vertical scrolling from document
        clearInterval(intervalID);
        setInterval(() => {
            document.documentElement.scrollLeft = 0;
            if (++counter === 20) {
                clearInterval(intervalID);
                counter = 0;
            }
        }, 100);
        scrollToSlide(DETAIL.element);
    }
});
