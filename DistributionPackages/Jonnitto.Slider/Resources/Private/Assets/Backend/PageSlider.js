import ButtonContextBar from 'Carbon.Frontend/Resources/Private/Assets/Backend/ButtonContextBar';
import { checkNodeType, checkNodeName } from './Node';
import Gator from 'gator';

const CONTAINER = document.getElementById('slider-edit');
const NODE_TYPE = 'Jonnitto.Slider:PageSlider.Slide';
const CONTEXT_BUTTON = {
    check: () => !!CONTAINER,
    title: CONTAINER ? CONTAINER.querySelector('h1').textContent : false,
    icon: 'images',
    className: 'toggle-slider',
    toggleClass: '-slider--visible',
    onInactive: () => {
        location.reload();
    }
};

Gator(document).on('click', '.toggle-slider-empty, .slider__slide--page', () => {
    ButtonContextBar.trigger(CONTEXT_BUTTON);
});

Gator(document).on('Neos.NodeSelected', event => {
    const NODE = event.detail.node;
    if (
        (checkNodeType(NODE, NODE_TYPE) || checkNodeName(NODE, 'pageslides')) &&
        !document.documentElement.classList.contains(CONTEXT_BUTTON.toggleClass)
    ) {
        ButtonContextBar.trigger(CONTEXT_BUTTON);
    }
});

ButtonContextBar.toggle(CONTEXT_BUTTON);
