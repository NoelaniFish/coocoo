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

        if (confidence > 0.6 && transcriptLength > 3) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            // Always play a sound response if confidence is low or no input
            playAudioForDuration(audios.greeting, 1);
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
    motherly: ["love", "support", "hug", "calm", "family", "pets", "caring", "nurturing"],
    aggressive: ["tear", "destroy", "rage", "hate", "fight", "angry", "furious"],
    defensive: ["me", "myself", "stop", "scared", "why", "leave me alone"],
    flirtatious: ["cute", "fun", "flirt", "sexy", "gorgeous", "hot", "kiss", "darling"],
    danger: ["danger", "alert", "run", "suspicious", "trap", "beware", "caution"],
    terrified: ["freaking out", "shaking", "scared", "panic", "help", "nightmare"]
};

// Function to categorize and respond based on keywords
function categorizeAndRespond(text, duration) {
    let audio = audios.greeting; // Default to greeting if no match

    for (const [category, words] of Object.entries(keywords)) {
        const matchedWords = words.filter(word => text.includes(word));
        if (matchedWords.length > 0) {
            console.log("Matched category:", category);
            audio = audios[category];
            break;
        }
    }

    // Always play an audio response
    playAudioForDuration(audio, duration || 1);
}

// Play audio function that ensures a response
function playAudioForDuration(audio, duration) {
    console.log("Playing audio:", audio.src, "for duration:", duration);
    audio.currentTime = 0;
    audio.play().catch(err => console.error("Error playing audio:", err));
    setTimeout(() => {
        audio.pause();
    }, duration * 1000);
}

// Event listeners for mouse clicks to control recognition
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
