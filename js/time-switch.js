document.addEventListener("DOMContentLoaded", function () {
    const citySwitch = document.getElementById("citySwitch");
    const timeSwitch = document.getElementById("timeSwitch");

    async function updateTime() {
        const city = citySwitch.textContent.trim();

        const timeZones = {
            "Paris": "Europe/Paris",
            "New York": "America/New_York",
            "Tokyo": "Asia/Tokyo",
            "London": "Europe/London",
            "Sydney": "Australia/Sydney",
            "Dubai": "Asia/Dubai"
        };

        const timeZone = timeZones[city] || "UTC";

        const now = new Date();
        const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = new Intl.DateTimeFormat('fr-FR', options).format(now);

        timeSwitch.textContent = timeString;
    }

    setInterval(updateTime, 1000);
    updateTime();
});