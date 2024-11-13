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
    const transcriptLength = transcript.trim().length;

    console.log("Transcript:", transcript);
    console.log("Confidence:", confidence);

    // Only respond if confidence is high and speech is long enough
    if (confidence > 0.7 && transcriptLength > 10) {
        const duration = (statementEndTime - statementStartTime) / 1000;
        categorizeAndRespond(transcript, duration);
    } else {
        console.log("Ignored due to low confidence or short input.");
    }
};

recognition.onspeechend = () => {
    const speechDuration = (statementEndTime - statementStartTime) / 1000;
    if (speechDuration < 1.5) {
        console.log("Speech too short, ignoring.");
        recognition.stop();
        restartRecognition();
        return;
    }
    console.log("User stopped speaking.");
    recognition.stop();
    statusText.textContent = "Not Listening";
    statusText.classList.remove('listening');
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
    }, 1500); // Slight delay to prevent picking up its own audio
}

// Categorize speech and respond with refined keywords
function categorizeAndRespond(text, duration) {
    let audio;

    // **Greeting (Coo-Greeting)**
    if (/\b(hi|hello|hey|good day|honey|pookie|sweetie|how’s it|dawn|goodnight|pleasure|greetings|farewell|take care|goodbye|miss you)\b/.test(text)) {
        audio = audios.greeting;

    // **Motherly-Nurturing**
    } else if (/\b(calm|care|love|family|friend|support|laughter|sunset|nature|peaceful|hometown|pets|help|warmth|gentle|kind|funny)\b/.test(text)) {
        audio = audios.motherly;

    // **Aggressive-Territorial**
    } else if (/\b(tear|bruise|knock|beatdown|break|stomp|crush|burn|fire|fuck|bitch|pussy|kill|threat)\b/.test(text)) {
        audio = audios.aggressive;

    // **Defensive**
    } else if (/\b(me|myself|attack|blame|wrong|understand|stop|ugly|I’m trying|not fair|judge|I’m doing my best)\b/.test(text)) {
        audio = audios.defensive;

    // **Flirtatious**
    } else if (/\b(eyes|smile|charm|sex|love|party|dance|flirt|hook up|cute|fun|laugh)\b/.test(text)) {
        audio = audios.flirtatious;

    // **Potential Danger**
    } else if (/\b(watch out|careful|danger|alert|run|trap|stay away|get out|not safe|keep distance)\b/.test(text)) {
        audio = audios.danger;

    // **Terrified**
    } else if (/\b(freaking|shaking|trembling|paralyzed|scared|terrified|panic|nightmare|shock|control|heart racing|breathe)\b/.test(text)) {
        audio = audios.terrified;

    // **Territorial-Soft**
    } else if (/\b(mine|hands off|space|territory|claim|turf|protect|right|belong|first)\b/.test(text)) {
        audio = audios.territorial;
    }

    if (audio) {
        playAudioForDuration(audio, duration);
    }
}

// Play the audio for the specified duration
function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
        restartRecognition();
    }, duration * 1000);
}

// Start listening on page load
window.onload = initSpeechRecognition;
