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
        statementStartTime = new Date().getTime(); // Start time
    };

    recognition.onresult = (event) => {
        statementEndTime = new Date().getTime(); // End time
        const transcript = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;

        console.log("Transcript:", transcript);
        console.log("Confidence:", confidence);

        if (confidence > 0.6) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            detectEmotionAndRespond(transcript, duration);
        } else {
            console.log("Low confidence, not responding.");
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

// Detect emotions and play corresponding audio
function detectEmotionAndRespond(text, duration) {
    const audio = getAudioForEmotion(text);
    playAudioForDuration(audio, duration);
}

// Determine which audio to play based on the detected emotion
function getAudioForEmotion(text) {
    if (/hi|hello|hey/.test(text)) return audios.greeting;
    if (/angry|furious|rage/.test(text)) return audios.aggressive;
    if (/defensive|insecure|small/.test(text)) return audios.defensive;
    if (/flirt|sexy|beautiful/.test(text)) return audios.flirtatious;
    if (/care|nurture|mother/.test(text)) return audios.motherly;
    if (/danger|protest|threat/.test(text)) return audios.danger;
    if (/scared|terrified|petrified/.test(text)) return audios.terrified;
    if (/territory|mine|protect/.test(text)) return audios.territorial;
    
    // Default to "coo-greeting" if no emotion is detected
    console.log("No specific emotion detected, using default greeting.");
    return audios.greeting;
}

// Play the audio for the specified duration
function playAudioForDuration(audio, duration) {
    console.log(`Playing audio for ${duration} seconds.`);
    audio.currentTime = 0;

    audio.play()
        .then(() => {
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0; // Reset audio
                restartRecognition();
            }, duration * 1000); // Convert duration to milliseconds
        })
        .catch(error => {
            console.error("Error playing audio:", error);
        });
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
