document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const offsetX = 32;
    const offsetY = 32;
    const speed = 0.3;

    cursor.style.opacity = "0";

    document.addEventListener("mousemove", (e) => {
        if (mouseX === 0 && mouseY === 0) {
            mouseX = e.clientX + offsetX;
            mouseY = e.clientY + offsetY;
            cursorX = mouseX;
            cursorY = mouseY;
            cursor.style.opacity = "1";
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        }
    }, { once: true });

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX + offsetX;
        mouseY = e.clientY + offsetY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        const angle = cursor.classList.contains("hover") ? -15 : 0;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) rotate(${angle}deg)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll("[data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("hover");
            cursor.innerHTML = el.getAttribute("data-cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("hover");
            cursor.innerHTML = "";
        });
    });
});