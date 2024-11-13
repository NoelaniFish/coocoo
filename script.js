let recognition;
let statementStartTime, statementEndTime;
const statusText = document.getElementById('status');

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
            // Always play a sound response
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
    };

    recognition.onend = () => {
        console.log("Recognition ended.");
    };
}

// Comprehensive keyword list for each category
const keywords = {
    motherly: [
        "calm", "love", "support", "hug", "I love you", "marry me", "chosen family", "love of my life", 
        "you mean the world", "pets", "mother", "father", "siblings", "doggo", "home", "meadow", "nature"
    ],
    aggressive: [
        "tear", "destroy", "rage", "cancel", "hate", "fuck no", "disgust me", "burn it down", "violence", 
        "fight", "dominance", "pissed", "annoying", "triggered", "angry", "furious"
    ],
    defensive: [
        "me", "myself", "stop", "scared", "why is this happening", "leave me alone", 
        "I didn’t mean it", "overwhelmed", "lost", "not good enough", "hurt"
    ],
    flirtatious: [
        "cute", "fun", "flirt", "crush", "lesbian", "hot", "sexy", "stunning", "gorgeous", 
        "sweetie", "darling", "kiss", "horny", "wink", "femme"
    ],
    danger: [
        "danger", "alert", "red flag", "run", "be careful", "suspicious", "creepy", 
        "get out", "evacuate", "trap", "beware", "caution", "brace yourself"
    ],
    terrified: [
        "freaking out", "shaking", "scared", "panic", "help me", "dread", "I can’t breathe", 
        "nightmare", "heart racing", "crying", "paralyzed", "hyperventilating"
    ]
};

// Function to categorize and respond based on keywords
function categorizeAndRespond(text, duration) {
    let audio = audios.greeting; // Default to greeting

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            audio = audios[category];
            break;
        }
    }

    playAudioForDuration(audio, duration);
}

// Play audio function that ensures a response
function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
    }, duration * 1000);
}

// Event listeners for mouse clicks
document.addEventListener('mousedown', () => {
    if (!recognition?.started) {
        initSpeechRecognition();
        recognition.start();
        recognition.started = true;
    }
});

document.addEventListener('mouseup', () => {
    if (recognition?.started) {
        recognition.stop();
        recognition.started = false;
    }
});
