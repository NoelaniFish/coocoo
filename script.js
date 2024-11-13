let recognition;
let greetingAudio, aggressiveAudio, defensiveAudio, flirtatiousAudio;
let motherlyAudio, dangerAudio, terrifiedAudio, territorialSoftAudio;

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
        alert("Your browser does not support speech recognition. Please use Chrome.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // When it starts listening
    recognition.onstart = () => {
        document.body.classList.add('inverted'); // Invert colors when listening
        document.getElementById('transcript').innerText = "Listening...";
    };

    // When it detects speech
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        document.getElementById('transcript').innerText = `You said: ${transcript}`;
        handleSpeechInput(transcript);
    };

    // If an error occurs, restart listening
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    // When speech recognition ends, restart it
    recognition.onend = () => {
        document.body.classList.remove('inverted'); // Revert colors
        restartRecognition();
    };

    // Start listening
    recognition.start();
}

// Function to restart recognition after a short delay
function restartRecognition() {
    setTimeout(() => {
        recognition.start();
    }, 500);
}

// Handle the user's speech input and play corresponding audio
function handleSpeechInput(text) {
    let audioQueue = [];

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

    playAudioQueue(audioQueue);
}

// Play audio files sequentially
function playAudioQueue(queue) {
    if (queue.length === 0) return;

    const audio = queue.shift();
    audio.currentTime = 0;
    audio.play();

    audio.onended = () => {
        playAudioQueue(queue);
    };
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
