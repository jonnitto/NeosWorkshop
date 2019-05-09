import ScrollReveal from 'scrollreveal';
import isLive from 'Carbon.Frontend/Resources/Private/Assets/Scripts/isLive';

if (isLive) {
    ScrollReveal().reveal('.reveal,.reveals > *', {
        distance: '20px',
        interval: 120
    });
}
