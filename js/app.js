"use strict";


/*
    GOJO SENSI
    Main Application
*/


const sliders = [
    "general",
    "redDot",
    "scope2",
    "scope4",
    "sniper",
    "freeLook"
];


const defaults = {
    general: 90,
    redDot: 85,
    scope2: 80,
    scope4: 75,
    sniper: 60,
    freeLook: 70
};


/*
    SLIDER VALUES
*/

sliders.forEach((name) => {

    const slider = document.getElementById(name);
    const output = document.getElementById(
        name + "Value"
    );

    slider.addEventListener("input", () => {

        output.textContent = slider.value;

    });

});


/*
    GENERATOR PRESETS
*/

const presets = {

    low: {
        balanced: [85, 80, 75, 70, 55, 65],
        rush: [95, 90, 85, 80, 60, 70],
        "one-tap": [90, 88, 80, 75, 55, 65],
        drag: [92, 86, 78, 72, 55, 68]
    },

    mid: {
        balanced: [90, 85, 80, 75, 60, 70],
        rush: [98, 94, 88, 82, 65, 75],
        "one-tap": [95, 92, 84, 78, 62, 70],
        drag: [96, 90, 82, 76, 60, 72]
    },

    high: {
        balanced: [95, 90, 85, 80, 65, 75],
        rush: [100, 98, 94, 88, 70, 80],
        "one-tap": [98, 95, 90, 84, 68, 76],
        drag: [99, 94, 88, 82, 65, 78]
    }

};


/*
    GENERATE
*/

const generateBtn =
    document.getElementById("generateBtn");


generateBtn.addEventListener("click", generateSensi);


function generateSensi() {

    const device =
        document.getElementById("device").value;

    const style =
        document.getElementById("style").value;


    const values =
        presets[device][style];


    sliders.forEach((name, index) => {

        const value = values[index];

        const slider =
            document.getElementById(name);

        const output =
            document.getElementById(
                name + "Value"
            );

        slider.value = value;

        output.textContent = value;

    });


    updateResults();


    const resultPanel =
        document.getElementById("resultPanel");


    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/*
    UPDATE RESULT CARDS
*/

function updateResults() {

    document.getElementById(
        "resultGeneral"
    ).textContent =
        document.getElementById(
            "general"
        ).value;


    document.getElementById(
        "resultRedDot"
    ).textContent =
        document.getElementById(
            "redDot"
        ).value;


    document.getElementById(
        "resultScope2"
    ).textContent =
        document.getElementById(
            "scope2"
        ).value;


    document.getElementById(
        "resultScope4"
    ).textContent =
        document.getElementById(
            "scope4"
        ).value;


    document.getElementById(
        "resultSniper"
    ).textContent =
        document.getElementById(
            "sniper"
        ).value;


    document.getElementById(
        "resultFreeLook"
    ).textContent =
        document.getElementById(
            "freeLook"
        ).value;

}


/*
    RESET
*/

const resetBtn =
    document.getElementById("resetBtn");


resetBtn.addEventListener("click", () => {

    sliders.forEach((name) => {

        const slider =
            document.getElementById(name);

        const output =
            document.getElementById(
                name + "Value"
            );

        slider.value = defaults[name];

        output.textContent =
            defaults[name];

    });


    document.getElementById("device").value =
        "mid";


    document.getElementById("style").value =
        "balanced";


    updateResults();


    document.getElementById(
        "copyStatus"
    ).textContent = "";

});


/*
    COPY SETTINGS
*/

const copyBtn =
    document.getElementById("copyBtn");


copyBtn.addEventListener("click", async () => {

    const text = getSettingsText();


    try {

        await navigator.clipboard.writeText(text);

        showCopyMessage(
            "Settings copied!"
        );

    } catch (error) {

        fallbackCopy(text);

    }

});


function getSettingsText() {

    return `GOJO SENSI

General: ${document.getElementById("general").value}
Red Dot: ${document.getElementById("redDot").value}
2X Scope: ${document.getElementById("scope2").value}
4X Scope: ${document.getElementById("scope4").value}
Sniper: ${document.getElementById("sniper").value}
Free Look: ${document.getElementById("freeLook").value}

Device: ${document.getElementById("device").value}
Style: ${document.getElementById("style").value}`;


}


function showCopyMessage(message) {

    const status =
        document.getElementById("copyStatus");

    status.textContent = message;


    setTimeout(() => {

        status.textContent = "";

    }, 2500);

}


/*
    FALLBACK COPY
*/

function fallbackCopy(text) {

    const textarea =
        document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();

    try {

        document.execCommand("copy");

        showCopyMessage(
            "Settings copied!"
        );

    } catch (error) {

        showCopyMessage(
            "Copy failed. Select the settings manually."
        );

    }

    document.body.removeChild(textarea);

}


/*
    LIVE RESULT UPDATES
*/

sliders.forEach((name) => {

    document
        .getElementById(name)
        .addEventListener(
            "input",
            updateResults
        );

});


/*
    PWA INSTALLATION
*/

let deferredPrompt = null;

const installBtn =
    document.getElementById("installBtn");


window.addEventListener(
    "beforeinstallprompt",
    (event) => {

        event.preventDefault();

        deferredPrompt = event;

        installBtn.classList.remove(
            "hidden"
        );

    }
);


installBtn.addEventListener(
    "click",
    async () => {

        if (!deferredPrompt) {
            return;
        }


        deferredPrompt.prompt();


        await deferredPrompt.userChoice;


        deferredPrompt = null;

        installBtn.classList.add(
            "hidden"
        );

    }
);


window.addEventListener(
    "appinstalled",
    () => {

        installBtn.classList.add(
            "hidden"
        );

        deferredPrompt = null;

    }
);


/*
    SERVICE WORKER
*/

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("sw.js")
                .then(() => {

                    console.log(
                        "GOJO SENSI service worker registered."
                    );

                })
                .catch((error) => {

                    console.error(
                        "Service worker error:",
                        error
                    );

                });

        }
    );

}


/*
    INITIALIZE
*/

updateResults();
