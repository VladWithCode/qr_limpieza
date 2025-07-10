import gsap from 'gsap';

gsap.defaults({
    ease: 'power2.out',
});

export function fadeIn(el, opts = {}, pos = '') {
    gsap.to(el, {
        y: '0%',
        opacity: 1,
        duration: 0.5,
        ...opts,
    }, pos);
}
