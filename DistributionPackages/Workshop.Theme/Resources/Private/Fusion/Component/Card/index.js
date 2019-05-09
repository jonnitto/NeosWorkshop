import Gator from 'Carbon.Frontend/Resources/Private/Assets/Gator';
import nodeArray from 'Carbon.Frontend/Resources/Private/Assets/Scripts/nodeArray';
import isLive from 'Carbon.Frontend/Resources/Private/Assets/Scripts/isLive';

const CARD_CLS = '.card__content';
const ROTATE = 2;
const IMG_PARALLAX = -4;

if (isLive) {
    Gator(window).on('resize', function() {
        nodeArray(CARD_CLS).forEach(card => {
            card.data = null;
        });
    });

    Gator(document).on(['mouseout', 'mousemove'], CARD_CLS, function(event) {
        if (!this.data) {
            let rect = this.getBoundingClientRect();
            this.data = {
                w: rect.width,
                h: rect.height,
                x: Math.floor(rect.left + rect.width / 2),
                y: Math.floor(rect.top + rect.height / 2),
                img: this.querySelector('figure img')
            };
        }
        let x = 0;
        let y = 0;
        if (event.type != 'mouseout') {
            y = (
                ((event.clientX - this.data.x) / this.data.h) *
                ROTATE
            ).toFixed(2);
            x = (
                ((event.clientY - this.data.y) / this.data.w) *
                -ROTATE
            ).toFixed(2);
        }
        requestAnimationFrame(update.bind(null, this, x, y));
    });
}

function update(element, x, y) {
    if (element) {
        element.style.transform = `rotateY(${y}deg) rotateX(${x}deg)`;
        if (element.data.img) {
            element.data.img.style.transform = `translate(${y *
                IMG_PARALLAX}px,${x * IMG_PARALLAX}px)`;
        }
    }
}
