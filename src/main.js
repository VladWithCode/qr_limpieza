import gsap from 'gsap';
import * as animations from './animations.js';

const COLOR_PRIMARY = '#009473FF';
const COLOR_PRIMARY_TRANSPARENT = '#00947300';

document.addEventListener('DOMContentLoaded', () => {
    let isMenuOpen = false;
    const menuToggler = document.querySelector('#menu-toggler');
    const topOsbv = new IntersectionObserver(handleTopIntersection);
    const viewAnimateObsv = new IntersectionObserver(handleViewAnimateIntersection);
    const viewAnimateEls = document.querySelectorAll('[data-view-animate]');

    for (const el of viewAnimateEls) {
        viewAnimateObsv.observe(el);
    }

    topOsbv.observe(document.getElementById('top-osbv-target'));
    menuToggler.addEventListener('click', () => {
        if (!isMenuOpen) {
            document.getElementById('menu').setAttribute('data-mobile-state', 'open');
            gsap.to('#menu', {
                duration: 0.2,
                y: '3rem',
            });
            gsap.to('[data-toggler-line="2"]', {
                duration: 0.2,
                width: '0%',
            });
            gsap.set('[data-toggler-line]:not([data-toggler-line="2"])', {
                position: 'absolute',
                y: '-50%',
                x: '-50%',
                top: '50%',
                left: '50%',
            });
            gsap.to('[data-toggler-line="1"]', {
                rotate: '-45deg',
                duration: 0.2,
            });
            gsap.to('[data-toggler-line="3"]', {
                rotate: '45deg',
                duration: 0.2,
            });

            if (document.getElementById('header').getAttribute('data-at-top') === '1') {
                gsap.to('#header', {
                    duration: 0.2,
                    background: COLOR_PRIMARY,
                    position: 'fixed',
                }, "<");
            }
        } else {
            document.getElementById('menu').setAttribute('data-mobile-state', 'closed');
            gsap.to('#menu', {
                duration: 0.2,
                y: '-100%',
            });
            gsap.to('[data-toggler-line="2"]', {
                duration: 0.2,
                width: '1.25rem',
            });
            gsap.set('[data-toggler-line]:not([data-toggler-line="2"])', {
                position: 'relative',
                y: '',
                x: '',
                top: '',
                left: '',
            });
            gsap.to('[data-toggler-line="1"]', {
                rotate: '0deg',
                duration: 0.2,
            });
            gsap.to('[data-toggler-line="3"]', {
                rotate: '0deg',
                duration: 0.2,
            });

            if (document.getElementById('header').getAttribute('data-at-top') === '1') {
                gsap.to('#header', {
                    duration: 0.2,
                    background: COLOR_PRIMARY_TRANSPARENT,
                    stagger: 0.05,
                    position: 'absolute',
                });
            }
        }

        isMenuOpen = !isMenuOpen;
    });

    function handleTopIntersection(ents) {
        const ent = ents[0];
        const header = document.getElementById('header');
        const mobOpen = document.getElementById('menu').getAttribute('data-mobile-state') === 'open';

        if (mobOpen) {
            return
        }

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
