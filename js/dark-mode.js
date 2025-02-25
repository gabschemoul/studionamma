/*document.addEventListener("DOMContentLoaded", function () {
    const modeSwitch = document.getElementById("modeSwitch");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("is-dark");
        modeSwitch.textContent = "Light mode";
    } else {
        modeSwitch.textContent = "Dark mode";
    }

    modeSwitch.addEventListener("click", function () {
        if (body.classList.contains("is-dark")) {
            body.classList.remove("is-dark");
            modeSwitch.textContent = "Dark mode";
            localStorage.setItem("darkMode", "disabled");
        } else {
            body.classList.add("is-dark");
            modeSwitch.textContent = "Light mode";
            localStorage.setItem("darkMode", "enabled");
        }
    });
});*/