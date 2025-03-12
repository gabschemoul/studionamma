document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrambleTextPlugin);

    document.querySelectorAll(".is-scramble").forEach((element) => {
        const originalText = element.textContent; // Garde le texte original

        element.addEventListener("mouseenter", () => {
            gsap.to(element, {
                duration: 0.6,
                scrambleText: {
                    text: originalText,
                    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    speed: 0.3,
                    revealDelay: 0.2,
                },
                ease: "power2.out"
            });
        });

        element.addEventListener("mouseleave", () => {
            gsap.to(element, {
                duration: 0.6,
                scrambleText: originalText,
                ease: "power2.out"
            });
        });
    });

    document.querySelectorAll(".has-scramble").forEach((element) => {
        const monoText = element.querySelector(".text-mono");
        const originalText = monoText.textContent; // Garde le texte original

        element.addEventListener("mouseenter", () => {
            gsap.to(monoText, {
                duration: 0.6,
                scrambleText: {
                    text: originalText,
                    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    speed: 0.3,
                    revealDelay: 0.2,
                },
                ease: "power2.out"
            });
        });

        element.addEventListener("mouseleave", () => {
            gsap.to(monoText, {
                duration: 0.6,
                scrambleText: originalText,
                ease: "power2.out"
            });
        });
    });
});