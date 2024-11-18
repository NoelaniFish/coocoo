let recognition;
let statementStartTime, statementEndTime;
const statusText = document.getElementById('status');
let isRecognitionActive = false;

// Load audio files
const audios = {
    conversational: new Audio('conversational.mp3'),
    homing: new Audio('homing.mp3'),
    moan: new Audio('moan.mp3),
    aggressive: new Audio('aggressive.mp3'),
    defensive: new Audio('defensive.mp3'),
    mating: new Audio('mating.mp3'),
    grunt: new Audio('grunt.mp3'),
    wingwhistle: new Audio('wingwhistle.mp3'),
    grunts: new Audio('grunts.mp3'),
    territorial: new Audio('territorial.mp3')
    
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
