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
        console.log("Listening...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Heard:", transcript);

        // Clear the previous pause timer if there's more speech input
        clearTimeout(pauseTimer);

        // Start a new timer to detect if the user has paused for 1.5 seconds
        pauseTimer = setTimeout(() => {
            console.log("Detected a pause, responding...");
            handleSpeechInput(transcript);
        }, 1500); // 1.5-second pause
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        console.log("Recognition ended, restarting...");
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

// Handle speech input and play corresponding audio
function handleSpeechInput(text) {
    let audioQueue = [];

    // Detect emotional tone from the input and queue corresponding audio files
    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        audioQueue.push(greetingAudio);
    }
    if (text.includes("angry") || text.includes("furious") || text.includes("rage")) {
        audioQueue.push(aggressiveAudio);
    }
    if (text.includes("defensive") || text.includes("insecure") || text.includes("small")) {
        audioQueue.push(defensiveAudio);
    }
    if (text.includes("flirt") || text.includes("sexy") || text.includes("beautiful")) {
        audioQueue.push(flirtatiousAudio);
    }
    if (text.includes("care") || text.includes("nurture") || text.includes("mother")) {
        audioQueue.push(motherlyAudio);
    }
    if (text.includes("danger") || text.includes("protest") || text.includes("threat")) {
        audioQueue.push(dangerAudio);
    }
    if (text.includes("scared") || text.includes("terrified") || text.includes("petrified")) {
        audioQueue.push(terrifiedAudio);
    }
    if (text.includes("territory") || text.includes("mine") || text.includes("protect")) {
        audioQueue.push(territorialSoftAudio);
    }

    // Play the queued audio files sequentially
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
