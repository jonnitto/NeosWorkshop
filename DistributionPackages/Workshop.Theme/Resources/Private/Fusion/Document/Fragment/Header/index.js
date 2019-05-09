import {
    Gator,
    mobileMenu
} from 'Carbon.Frontend/Resources/Private/Assets/MobileMenu';

import jump from 'jump.js';

let menu = mobileMenu({
    selector: {
        header: '.page-header',
        navigation: '.mainnav',
        hamburger: '.hamburger-icon'
    },
    setTop: false
});

Gator(document).on('click', '.mainnav__link--scroll', function(event) {
    let id = this.getAttribute('href').slice(1);
    let target = document.getElementById(id);

    if (target) {
        menu.hideMenu();
        event.preventDefault();
        jump(target);
    }
});
