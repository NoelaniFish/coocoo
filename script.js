let recognition;
let greetingAudio, aggressiveAudio, defensiveAudio, flirtatiousAudio;
let motherlyAudio, dangerAudio, terrifiedAudio, territorialSoftAudio;
let pauseTimer; // Timer to detect pauses

// Load audio files
function preloadAudios() {
    greetingAudio = new Audio('coo-greeting.mp3');
    aggressiveAudio = new Audio('aggressive-territorial.mp3');
    defensiveAudio = new Audio('defensive.mp3');
    flirtatiousAudio = new Audio('flirtatious.mp3');
    motherlyAudio = new Audio('motherly-nuturing.mp3');
    dangerAudio = new Audio('potential-danger.mp3');
    terrifiedAudio = new Audio('terrified-petrified-grunts.mp3');
    territorialSoftAudio = new Audio('territorial-soft.mp3');
}

preloadAudios();

// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Google Chrome.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = true; // Allow interim results to detect pauses early
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        document.body.classList.add('inverted'); // Invert colors when listening
        console.log("Listening...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Heard:", transcript);

        // Clear the previous pause timer if there's more speech input
        clearTimeout(pauseTimer);

        // Start a new timer to detect if the user has paused for 2.8 seconds
        pauseTimer = setTimeout(() => {
            console.log("Detected a pause, responding...");
            handleSpeechInput(transcript);
        }, 2800); // 2.8-second pause
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        document.body.classList.remove('inverted'); // Revert colors
        restartRecognition();
    };

    recognition.start();
}

// Function to restart recognition after a short delay
function restartRecognition() {
    setTimeout(() => {
        try {
            recognition.start();
        } catch (error) {
            console.error("Failed to restart speech recognition:", error);
        }
    }, 500);
}

// Decode the speech input and play corresponding audio
function handleSpeechInput(text) {
    let audioQueue = [];

    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        audioQueue.push(greetingAudio);
    } else if (text.includes("angry") || text.includes("furious") || text.includes("rage")) {
        audioQueue.push(aggressiveAudio);
    } else if (text.includes("defensive") || text.includes("insecure") || text.includes("small")) {
        audioQueue.push(defensiveAudio);
    } else if (text.includes("flirt") || text.includes("sexy") || text.includes("beautiful")) {
        audioQueue.push(flirtatiousAudio);
    } else if (text.includes("care") || text.includes("nurture") || text.includes("mother")) {
        audioQueue.push(motherlyAudio);
    } else if (text.includes("danger") || text.includes("protest") || text.includes("threat")) {
        audioQueue.push(dangerAudio);
    } else if (text.includes("scared") || text.includes("terrified") || text.includes("petrified")) {
        audioQueue.push(terrifiedAudio);
    } else if (text.includes("territory") || text.includes("mine") || text.includes("protect")) {
        audioQueue.push(territorialSoftAudio);
    }

    playAudioQueue(audioQueue);
}

// Function to play the audio queue sequentially
function playAudioQueue(queue) {
    if (queue.length === 0) {
        restartRecognition(); // Restart listening after the queue is empty
        return;
    }

    const audio = queue.shift();
    audio.currentTime = 0;
    audio.play();

    audio.onended = () => {
        playAudioQueue(queue);
    };
}

// Automatically start listening when the page loads
window.onload = initSpeechRecognition;
