let recognition;
let statementStartTime, statementEndTime;

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
        console.log("Listening...");
        document.getElementById('status').textContent = "Listening...";
        statementStartTime = new Date().getTime();
    };

    recognition.onresult = (event) => {
        statementEndTime = new Date().getTime();
        const transcript = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;

        console.log("Transcript:", transcript);
        console.log("Confidence:", confidence);

        if (confidence > 0.5) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            console.log("Low confidence, defaulting to greeting.");
            playAudioForDuration(audios.greeting, 2);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        console.log("Recognition ended.");
        restartRecognition();
    };

    recognition.start();
}

// Restart recognition after a delay
function restartRecognition() {
    setTimeout(() => {
        try {
            recognition.start();
            console.log("Restarting recognition...");
        } catch (error) {
            console.error("Error restarting recognition:", error);
        }
    }, 500);
}

// Categorize speech and respond accordingly
function categorizeAndRespond(text, duration) {
    let audio;

    // Categorize based on the tone of the speech
    if (/hi|hello|hey|morning|afternoon|evening/.test(text)) {
        audio = audios.greeting; // Greeting or informal tone
    } else if (/friend|kind|nice|happy|care|support/.test(text)) {
        audio = audios.motherly; // Friendly or nurturing tone
    } else if (/angry|furious|rage|mad/.test(text)) {
        audio = audios.aggressive;
    } else if (/defensive|insecure|small|protect/.test(text)) {
        audio = audios.defensive;
    } else if (/flirt|sexy|beautiful|charming/.test(text)) {
        audio = audios.flirtatious;
    } else if (/danger|threat|warning|protest/.test(text)) {
        audio = audios.danger;
    } else if (/scared|terrified|petrified|fear/.test(text)) {
        audio = audios.terrified;
    } else if (/territory|mine|belong|protect/.test(text)) {
        audio = audios.territorial;
    } else {
        // Default to greeting if no specific tone is detected
        console.log("No clear tone detected, using default greeting.");
        audio = audios.greeting;
    }

    playAudioForDuration(audio, duration);
}

// Play the audio for the specified duration
function playAudioForDuration(audio, duration) {
    console.log(`Playing audio for ${duration} seconds.`);
    audio.currentTime = 0;

    audio.play()
        .then(() => {
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                restartRecognition();
            }, duration * 1000);
        })
        .catch(error => {
            console.error("Error playing audio:", error);
        });
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
