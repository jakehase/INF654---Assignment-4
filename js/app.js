function registerServiceWorker() {
    return navigator.serviceWorker.register('/sw.js');
}

function onServiceWorkerRegistered(registration) {
    console.log(`SW Registered (Scope: ${registration.scope})`);
}

function onServiceWorkerRegistrationFailed(error) {
    console.log(`SW Registration Failed: ${error}`);
}

function isServiceWorkerSupported() {
    return "serviceWorker" in navigator;
}

if (isServiceWorkerSupported()) {
    window.addEventListener("load", () => {
        registerServiceWorker()
            .then(onServiceWorkerRegistered)
            .catch(onServiceWorkerRegistrationFailed);
    });
} else {
    console.log("Browser does not support Service Workers");
}

