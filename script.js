let recognition;
let statementStartTime, statementEndTime;

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
    recognition.continuous = false; // Stop listening after speech is detected
    recognition.interimResults = false; // Only use final results
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

        if (confidence > 0.7) { // Higher confidence threshold to filter out noise
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            console.log("Low confidence, defaulting to greeting.");
            playAudioForDuration(audios.greeting, 2);
        }
    };

    // Stop listening when the user pauses speaking
    recognition.onspeechend = () => {
        console.log("User stopped speaking.");
        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        console.log("Recognition ended.");
    };

    recognition.start();
}

// Restart recognition after a delay
function restartRecognition() {
    setTimeout(() => {
        try {
            recognition.start();
        } catch (error) {
            console.error("Error restarting recognition:", error);
        }
    }, 1000);
}

// Categorize speech and respond
function categorizeAndRespond(text, duration) {
    let audio;

    // Categorize based on the tone of the speech
    if (/hi|hello|hey|morning|afternoon|evening/.test(text)) audio = audios.greeting;
    else if (/care|support|kind/.test(text)) audio = audios.motherly;
    else if (/angry|furious|rage/.test(text)) audio = audios.aggressive;
    else if (/defensive|insecure/.test(text)) audio = audios.defensive;
    else if (/flirt|sexy|beautiful/.test(text)) audio = audios.flirtatious;
    else if (/danger|threat/.test(text)) audio = audios.danger;
    else if (/scared|terrified/.test(text)) audio = audios.terrified;
    else if (/territory|mine/.test(text)) audio = audios.territorial;
    else audio = audios.greeting; // Default to greeting

    playAudioForDuration(audio, duration);
}

// Play audio for specified duration
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
        .catch(error => console.error("Error playing audio:", error));
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
