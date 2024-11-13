let recognition;
let statementCount = 0;

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
        console.log("Speech recognition started. Listening...");
        document.getElementById('status').textContent = "Listening...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const confidence = event.results[event.results.length - 1][0].confidence;
        console.log(`Transcript: ${transcript}, Confidence: ${confidence}`);

        // Only respond if confidence is above 0.5 (adjustable if needed)
        if (confidence > 0.5) {
            detectEmotionAndRespond(transcript);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        document.getElementById('status').textContent = "Error occurred. Restarting...";
        restartRecognition();
    };

    recognition.onend = () => {
        console.log("Speech recognition ended. Restarting...");
        restartRecognition();
    };

    recognition.start();
}

function restartRecognition() {
    setTimeout(() => {
        try {
            recognition.start();
            console.log("Restarting speech recognition...");
        } catch (error) {
            console.error("Error restarting recognition:", error);
        }
    }, 500);
}

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
        audioQueue.push(audios.motherly); // Default response
    }

    playAudioQueue(audioQueue);
}

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

window.onload = initSpeechRecognition;
