let recognition;
let statementCount = 0;

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

// Function to initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Google Chrome.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log("Speech recognition started.");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Transcript detected:", transcript);
        detectEmotionAndRespond(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        console.log("Speech recognition ended. Restarting...");
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

// Detect emotions and play the corresponding audio clip
function detectEmotionAndRespond(text) {
    console.log("Analyzing text:", text);

    if (/hi|hello|hey/.test(text)) {
        playAudio(audios.greeting, "Greeting");
    } else if (/angry|furious|rage/.test(text)) {
        playAudio(audios.aggressive, "Aggressive");
    } else if (/defensive|insecure|small/.test(text)) {
        playAudio(audios.defensive, "Defensive");
    } else if (/flirt|sexy|beautiful/.test(text)) {
        playAudio(audios.flirtatious, "Flirtatious");
    } else if (/care|nurture|mother/.test(text)) {
        playAudio(audios.motherly, "Motherly");
    } else if (/danger|protest|threat/.test(text)) {
        playAudio(audios.danger, "Danger");
    } else if (/scared|terrified|petrified/.test(text)) {
        playAudio(audios.terrified, "Terrified");
    } else if (/territory|mine|protect/.test(text)) {
        playAudio(audios.territorial, "Territorial");
    } else {
        console.log("No specific emotion detected, using default response.");
        playAudio(audios.motherly, "Default Motherly");
    }
}

// Function to play the audio and log the action
function playAudio(audio, label) {
    if (!audio) {
        console.error("Audio not found for:", label);
        return;
    }

    console.log(`Playing audio for: ${label}`);
    audio.currentTime = 0;

    audio.play()
        .then(() => {
            console.log(`Audio playing: ${label}`);
        })
        .catch(error => {
            console.error(`Error playing audio: ${label}`, error);
        });
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
