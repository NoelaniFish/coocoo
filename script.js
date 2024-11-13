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
        console.log("Listening...");
        statusText.textContent = "Listening...";
        statusText.classList.add('listening');
        statementStartTime = new Date().getTime();
    };

    recognition.onresult = (event) => {
        statementEndTime = new Date().getTime();
        const transcript = event.results[0][0].transcript.toLowerCase();
        const confidence = event.results[0][0].confidence;
        const transcriptLength = transcript.trim().length;

        console.log("Transcript:", transcript);
        console.log("Confidence:", confidence);

        if (confidence > 0.7 && transcriptLength > 10) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            console.log("Ignored due to low confidence or short input.");
        }
    };

    recognition.onspeechend = () => {
        console.log("Speech ended");
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

// Categorize speech and respond
function categorizeAndRespond(text, duration) {
    let audio;

    if (/\b(hi|hello|hey|greetings|goodbye|farewell|how’s it going)\b/.test(text)) {
        audio = audios.greeting;
    } else if (/\b(calm|love|family|support|peace|gentle|kind)\b/.test(text)) {
        audio = audios.motherly;
    } else if (/\b(tear|beatdown|crush|burn|threat|fuck|kill)\b/.test(text)) {
        audio = audios.aggressive;
    } else if (/\b(me|myself|blame|judge|I’m trying|stop)\b/.test(text)) {
        audio = audios.defensive;
    } else if (/\b(eyes|smile|love|flirt|sexy|vibe|dance)\b/.test(text)) {
        audio = audios.flirtatious;
    } else if (/\b(danger|run|alert|stay away|get out)\b/.test(text)) {
        audio = audios.danger;
    } else if (/\b(freaking|shaking|scared|panic|terrified|nightmare)\b/.test(text)) {
        audio = audios.terrified;
    } else if (/\b(mine|territory|claim|protect|right)\b/.test(text)) {
        audio = audios.territorial;
    }

    if (audio) {
        playAudioForDuration(audio, duration);
    }
}

// Play audio for specified duration
function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
    }, duration * 1000);
}

// Event listeners for mouse click
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
