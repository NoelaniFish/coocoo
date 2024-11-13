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

// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Please use Google Chrome for this feature.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Listen for one phrase at a time
    recognition.interimResults = false; // Only use final results
    recognition.lang = 'en-US';

    recognition.onstart = () => console.log("Listening...");

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;
        console.log("Transcript:", transcript, "| Confidence:", confidence);

        // Only respond if the confidence is reasonably high
        if (confidence > 0.6) {
            detectEmotionAndRespond(transcript);
        }
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
            console.log("Restarting recognition...");
        } catch (error) {
            console.error("Error restarting recognition:", error);
        }
    }, 1000);
}

// Detect emotions and respond with corresponding audio
function detectEmotionAndRespond(text) {
    const audioQueue = [];

    if (/hi|hello|hey/.test(text)) {
        audioQueue.push(audios.greeting);
    } else if (/angry|furious|rage/.test(text)) {
        audioQueue.push(audios.aggressive);
    } else if (/defensive|insecure|small/.test(text)) {
        audioQueue.push(audios.defensive);
    } else if (/flirt|sexy|beautiful/.test(text)) {
        audioQueue.push(audios.flirtatious);
    } else if (/care|nurture|mother/.test(text)) {
        audioQueue.push(audios.motherly);
    } else if (/danger|protest|threat/.test(text)) {
        audioQueue.push(audios.danger);
    } else if (/scared|terrified|petrified/.test(text)) {
        audioQueue.push(audios.terrified);
    } else if (/territory|mine|protect/.test(text)) {
        audioQueue.push(audios.territorial);
    } else {
        console.log("No specific emotion detected, using default response.");
        audioQueue.push(audios.motherly); // Default response
    }

    playAudioQueue(audioQueue);
}

// Play the queued audio files sequentially
function playAudioQueue(queue) {
    if (queue.length === 0) {
        restartRecognition();
        return;
    }

    const audio = queue.shift();
    audio.currentTime = 0;

    audio.play()
        .then(() => {
            console.log("Playing audio:", audio.src);
        })
        .catch(error => {
            console.error("Error playing audio:", error);
        });

    audio.onended = () => playAudioQueue(queue);
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
