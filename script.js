let recognition;
let pauseTimer = null;
const statusElement = document.getElementById('status');

// Load the audio files
const audios = {
    greeting: new Audio('coo-greeting.mp3'),
    aggressive: new Audio('aggressive-territorial.mp3'),
    defensive: new Audio('defensive.mp3'),
    flirtatious: new Audio('flirtatious.mp3'),
    motherly: new Audio('motherly-nuturing.mp3'),
    danger: new Audio('potential-danger.mp3'),
    terrified: new Audio('terrified-petrified-grunts.mp3'),
    territorial: new Audio('territorial-soft.mp3')
};

// Initialize the speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Please use Google Chrome for this feature.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusElement.textContent = "Listening...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Transcript detected:", transcript);
        statusElement.textContent = "Processing...";

        // Clear any existing pause timer
        clearTimeout(pauseTimer);

        // Start a timer for a 1.5-second pause
        pauseTimer = setTimeout(() => {
            recognition.stop();
            detectEmotionAndRespond(transcript);
        }, 1500);
    };

    recognition.onerror = (event) => {
        console.error("Error:", event.error);
        statusElement.textContent = "Error occurred. Restarting...";
        restartRecognition();
    };

    recognition.onend = () => {
        statusElement.textContent = "Waiting for you to speak...";
        restartRecognition();
    };

    recognition.start();
}

// Restart recognition
function restartRecognition() {
    setTimeout(() => {
        try {
            recognition.start();
        } catch (error) {
            console.error("Error restarting recognition:", error);
        }
    }, 500);
}

// Detect emotions and respond with appropriately timed audio
function detectEmotionAndRespond(text) {
    statusElement.textContent = "Analyzing emotions...";
    const durations = getEmotionDurations(text);
    const audioQueue = [];

    for (const [emotion, duration] of Object.entries(durations)) {
        const audio = audios[emotion];
        if (audio) {
            const adjustedAudio = adjustAudioDuration(audio, duration);
            audioQueue.push(adjustedAudio);
        }
    }

    playAudioQueue(audioQueue);
}

// Play the queued audio files sequentially
function playAudioQueue(queue) {
    if (queue.length === 0) {
        statusElement.textContent = "Waiting for you to speak...";
        restartRecognition();
        return;
    }

    const audio = queue.shift();
    audio.currentTime = 0;
    audio.play();

    audio.onended = () => playAudioQueue(queue);
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
