let recognition;
let statementStartTime, statementEndTime;
const statusText = document.getElementById('status');
let isRecognitionActive = false;

// Track category durations
const categoryDurations = {
    conversational: 0,
    homing: 0,
    aggressive: 0,
    defensive: 0,
    mating: 0,
    grunt: 0,
    wingwhistle: 0,
    territorial: 0
};

// Load audio files
const audioFiles = {
    conversational: new Audio('conversational.mp3'),
    homing: new Audio('homing.mp3'),
    aggressive: new Audio('aggressive.mp3'),
    defensive: new Audio('defensive.mp3'),
    mating: new Audio('mating.mp3'),
    grunt: new Audio('grunt.mp3'),
    wingwhistle: new Audio('wingwhistle.mp3'),
    territorial: new Audio('territorial.mp3')
};

// Initialize speech recognition
function initSpeechRecognition() {
    // Check if browser supports webkitSpeechRecognition
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Google Chrome.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusText.textContent = "Listening...";
        statusText.classList.add('listening');
        statementStartTime = new Date().getTime();
        console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
        statementEndTime = new Date().getTime();
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const confidence = event.results[event.results.length - 1][0].confidence;

        if (confidence > 0.6) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            playAudio(audioFiles.conversational);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        statusText.textContent = `Error: ${event.error}`;
        statusText.classList.remove('listening');

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            alert("Microphone access is blocked. Please check your browser settings.");
        }
        isRecognitionActive = false;
    };

    recognition.onend = () => {
        console.log("Speech recognition ended.");
        statusText.textContent = "Idle";
        statusText.classList.remove('listening');

        if (isRecognitionActive) {
            setTimeout(() => recognition.start(), 1000); // Restart after a brief pause
        }
    };

    // Start recognition
    try {
        recognition.start();
        isRecognitionActive = true;
        console.log("Speech recognition initialized");
    } catch (error) {
        console.error("Error starting speech recognition:", error);
    }
}

// Detect category based on keywords
function detectCategory(text) {
   // Ensure the keywords object is defined
const keywords = {
        conversational: ["hello", "hi", "hey"],
        homing: ["home", "return"],
        aggressive: ["attack", "fight", "angry"],
        defensive: ["defend", "protect"],
        mating: ["love", "mate", "court"],
        grunt: ["grunt", "growl"],
        wingwhistle: ["whistle", "flap"],
        territorial: ["territory", "mine", "keep out"]
    };


    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            return category;
        }
    }
    return 'conversational';
}

// Categorize and respond based on spoken input
function categorizeAndRespond(text, duration) {
    const category = detectCategory(text);
    categoryDurations[category] += duration;
    console.log(`Category: ${category}, Duration: ${duration}s`);
    playAudio(audioFiles[category]);
}

// Play audio without stopping previous sounds
function playAudio(audio) {
    if (audio) {
        const clonedAudio = audio.cloneNode(); // Allow overlapping sounds
        clonedAudio.play();
    }
}

// Start speech recognition when the page loads
window.onload = () => {
    initSpeechRecognition();
};


