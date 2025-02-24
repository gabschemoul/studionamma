document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("a");
    const soundSwitch = document.getElementById("soundSwitch");

    const soundSrc = "https://cdn.jsdelivr.net/gh/gabschemoul/studionamma@main/sounds/gameboy-bip.mp3";
    const toggleSoundSrc = "https://cdn.jsdelivr.net/gh/gabschemoul/studionamma@main/sounds/walkman.mp3";

    let toggleAudio = new Audio(toggleSoundSrc);
    toggleAudio.volume = 0.5;

    let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

    if(soundSwitch) {
        soundSwitch.innerText = soundEnabled ? "Sound on" : "Sound off";

        soundSwitch.addEventListener("click", function () {
            toggleAudio.currentTime = 0;
            toggleAudio.play().catch(error => console.error("Erreur de lecture du son du switch : ", error));

            soundEnabled = !soundEnabled;
            localStorage.setItem("soundEnabled", soundEnabled);
            soundSwitch.innerText = soundEnabled ? "Sound on" : "Sound off";
        });
    }

    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            if (soundEnabled) {
                let audio = new Audio(soundSrc);
                audio.volume = 0.3;
                audio.play().catch(error => console.error("Erreur de lecture audio : ", error));
            }
        });
    });
});