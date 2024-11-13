let recognition;
let statementStartTime, statementEndTime;
const statusText = document.getElementById('status');
let isRecognitionActive = false;

// Load audio files
const audios = {
    greeting: new Audio('coo-greeting.mp3'),
    motherly: new Audio('motherly-nuturing.mp3'),
    aggressive: new Audio('aggressive-territorial.mp3'),
    defensive: new Audio('defensive.mp3'),
    flirtatious: new Audio('flirtatious.mp3'),
    danger: new Audio('potential-danger.mp3'),
    terrified: new Audio('terrified-petrified-grunts.mp3'),
    territorial: new Audio('territorial-soft.mp3')
};

// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Please use Google Chrome for this feature.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusText.textContent = "Listening...";
        statusText.classList.add('listening');
        statementStartTime = new Date().getTime();
    };

    recognition.onresult = (event) => {
        statementEndTime = new Date().getTime();
        const transcript = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;
        const transcriptLength = transcript.trim().length;

        if (confidence > 0.6 && transcriptLength > 5) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            playAudioForDuration(audios.greeting, 2);
        }
    };

    recognition.onspeechend = () => {
        recognition.stop();
        statusText.textContent = "Not Listening";
        statusText.classList.remove('listening');
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        statusText.textContent = "Error: " + event.error;
        statusText.classList.remove('listening');
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        console.log("Recognition ended.");
    };
}

// Keyword categories
const keywords = {
    motherly: ["calm", "love", "support", "hug", "pets", "home", "nature"],
    aggressive: ["tear", "destroy", "rage", "hate", "violence", "angry"],
    defensive: ["me", "myself", "stop", "scared", "leave me alone", "hurt"],
    flirtatious: ["cute", "fun", "flirt", "hot", "sexy", "kiss", "femme"],
    danger: ["danger", "alert", "run", "suspicious", "evacuate", "beware"],
    terrified: ["panic", "help", "nightmare", "crying", "hyperventilating"]
};

function categorizeAndRespond(text, duration) {
    let audio = audios.greeting;

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text))) {
            audio = audios[category];
            break;
        }
    }

    playAudioForDuration(audio, duration);
}

function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, duration * 1000);
}

// Event listeners for mouse clicks
document.addEventListener('mousedown', () => {
    if (!isRecognitionActive) {
        initSpeechRecognition();
        recognition.start();
        isRecognitionActive = true;
    }
});

document.addEventListener('mouseup', () => {
    if (isRecognitionActive) {
        recognition.stop();
        isRecognitionActive = false;
    }
});
