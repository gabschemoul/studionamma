import LocomotiveScroll from "https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.esm.js";

document.addEventListener("DOMContentLoaded", () => {
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector('.page-wrapper'),
        smooth: true,
        multiplier: 0.5,
    });

    setInterval(() => {
        if (window.scroll && window.scroll.update) {
            window.scroll.update();
        }
    }, 3000);
});