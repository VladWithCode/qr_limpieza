import gsap from 'gsap';
import * as animations from './animations.js';

const COLOR_PRIMARY = '#009473FF';
const COLOR_PRIMARY_TRANSPARENT = '#00947300';

document.addEventListener('DOMContentLoaded', () => {
    const menuToggler = document.querySelector('#menu-toggler');
    const topOsbv = new IntersectionObserver(handleTopIntersection);
    const viewAnimateObsv = new IntersectionObserver(handleViewAnimateIntersection);
    const viewAnimateEls = document.querySelectorAll('[data-view-animate]');

    for (const el of viewAnimateEls) {
        viewAnimateObsv.observe(el);
    }

    topOsbv.observe(document.getElementById('top-osbv-target'));
    menuToggler.addEventListener('click', handleMenuToggle);

    function handleTopIntersection(ents) {
        const mobOpen = document.getElementById('menu').getAttribute('data-mobile-state') === 'open';
        if (mobOpen) {
            return
        }

        const ent = ents[0];
        const header = document.getElementById('header');

        if (ent.isIntersecting) {
            header.setAttribute('data-at-top', 1);
            gsap.to(header, { y: '0%', background: COLOR_PRIMARY_TRANSPARENT });
            gsap.set(header, { position: 'absolute', y: '-100%' })
        } else {
            header.setAttribute('data-at-top', 0);
            gsap.set(header, { position: 'fixed', y: '-100%' })
            gsap.to(header, { y: '0%', background: COLOR_PRIMARY });
        }
    }

    handleNavigationClicks();

    function handleMenuToggle() {
        const tl = gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.inOut' } });
        const isOpen = document.getElementById('menu').getAttribute('data-mobile-state') === 'open';

        if (!isOpen) {
            openMenu(tl);
        } else {
            closeMenu(tl);
        }
    }

    function handleViewAnimateIntersection(ents, obsv) {
        for (let ent of ents) {
            if (ent.isIntersecting) {
                const el = ent.target;
                const animate = el.getAttribute('data-view-animate');

                animations[animate](el, {
                    stagger: Number(el.dataset.viewAnimateStagger) || 0,
                    delay: Number(el.dataset.viewAnimateDelay) || 0,
                }, el.dataset.viewAnimatePos);

                obsv.unobserve(ent.target);
            }
        }
    }

});

function handleNavigationClicks() {
    const navAnchorEls = document.querySelectorAll('[data-nav-anchor]');
    const defaultActiveParent = document.querySelector('[data-nav-active]').parentElement;
    defaultActiveParent.style.backgroundColor = "var(--color-stone-50)";
    defaultActiveParent.style.color = "var(--color-stone-800)";
    defaultActiveParent.style.fontWeight = "var(--font-bold)";

    for (const anchor of navAnchorEls) {
        anchor.addEventListener('click', () => {
            const sectionId = anchor.href.split('#')[1];
            const navItem = document.querySelector(`[data-nav-id="${sectionId}"]`);
            const prevActive = document.querySelector('[data-nav-active]');
            const parent = navItem.parentElement;

            if (prevActive) {
                prevActive.removeAttribute('data-nav-active');
                prevActive.parentElement.style.backgroundColor = '';
                prevActive.parentElement.style.color = '';
                prevActive.parentElement.style.fontWeight = '';
            }

            navItem.setAttribute('data-nav-active', '');
            parent.style.backgroundColor = "var(--color-stone-50)";
            parent.style.color = "var(--color-stone-800)";
            parent.style.fontWeight = "var(--font-bold)";

            closeMenu(gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.inOut' } }));
        })
    }
}

function openMenu(tl) {
    document.getElementById('menu').setAttribute('data-mobile-state', 'open');
    tl.add("start")
        .to('#menu', { y: '3rem' })
        .to('[data-menu-animate="hor"', { x: '0%', opacity: 1, stagger: 0.1, duration: 0.4 }, "<50%")
        .to('[data-menu-animate="ver"', { y: '0%', opacity: 1, duration: 0.4 }, "<")
        .to('[data-toggler-line="2"]', {
            width: '0%',
        }, 0)
        .set('[data-toggler-line]:not([data-toggler-line="2"])', {
            position: 'absolute',
            y: '-50%',
            x: '-50%',
            top: '50%',
            left: '50%',
        }, "start").to('[data-toggler-line="1"]', {
            rotate: '-45deg',
        }, '').to('[data-toggler-line="3"]', {
            rotate: '45deg',
        }, '');

    if (document.getElementById('header').getAttribute('data-at-top') === '1') {
        tl.to('#header', {
            background: COLOR_PRIMARY,
            position: 'fixed',
        }, 0);
    }
}

function closeMenu(tl) {
    document.getElementById('menu').setAttribute('data-mobile-state', 'closed');
    tl.to('#menu', {
        y: '-100%',
    })
        .to('[data-menu-animate="hor"', { x: '100%', opacity: 0 })
        .to('[data-menu-animate="ver"', { y: '100%', opacity: 0 })
        .to('[data-toggler-line="2"]', {
            width: '1.25rem',
        }, '0+=50%')
        .set('[data-toggler-line]:not([data-toggler-line="2"])', {
            position: 'relative',
            y: '',
            x: '',
            top: '',
            left: '',
        }, '<')
        .to('[data-toggler-line="1"]', {
            rotate: '0deg',
        }, 0)
        .to('[data-toggler-line="3"]', {
            rotate: '0deg',
        }, 0);

    if (document.getElementById('header').getAttribute('data-at-top') === '1') {
        tl.to('#header', {
            background: COLOR_PRIMARY_TRANSPARENT,
            position: 'absolute',
        }, 0);
    }
}
