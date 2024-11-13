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

// Updated categorization with enhanced keywords
function categorizeAndRespond(text, duration) {
    let audio;

    // **Motherly / Nurturing / Everyday Man Speak**
    if (/\b(calm|love|support|peace|gentle|sweet|comfort|home|supportive|hug|take it easy|you’ve got this|rest up|let’s catch up|no worries|it’s all good|I’m here for you|take care|don’t stress it|hang in there|you’re doing great|you’ve got my support|just relax|you’re safe|I’m proud of you|focus on yourself|just breathe)\b/.test(text)) {
        audio = audios.motherly;

    // **Aggressive / Angry / Everyday Man Speak**
    } else if (/\b(tear|destroy|rage|fight|cancel culture|toxic | piss|pissed off|fed up|cut it out|I’m over it|mind your business|get lost|stop it now|you crossed the line|that’s enough|you’ve gone too far|stay out of my way|enough is enough|get a grip|back off|I’ve had it with you|don’t mess with me|I’m done with this)\b/.test(text)) {
        audio = audios.aggressive;

    // **Defensive / Insecure / Everyday Man Speak**
    } else if (/\b(me|myself|stop|defend|I’m scared|that’s not fair|you don’t understand|why me?|I’m trying my best|please don’t judge me|I didn’t mean it|I don’t know what else to do|why is this always happening to me?|I’m not wrong|I don’t belong here|I feel lost|why are you blaming me?|I’m doing my best)\b/.test(text)) {
        audio = audios.defensive;

    // **Flirtatious / Playful / Everyday Man Speak**
    } else if (/\b(eyes|smile|love|cute|fun|flirt|crush|bae|you look great|nice to see you|we should hang out|let’s grab a drink|you’ve got great vibes|I can’t stop thinking about you|I love your smile|you’re fun to be around|let’s do this again|you light up the room|you’re really cool|I’ve got a crush on you|you’re so easy to talk to)\b/.test(text)) {
        audio = audios.flirtatious;

    // **Potential Danger / Warning / Everyday Man Speak**
    } else if (/\b(danger|alert|run|red flag|be careful|get out|watch out|stay safe|this isn’t good|take cover|it’s not safe|hold up|heads up|stay alert|back away|don’t go there|that’s risky|get away|this could get bad|it’s a trap|look out)\b/.test(text)) {
        audio = audios.danger;

    // **Terrified / Fear / Everyday Man Speak**
    } else if (/\b(freaking out|shaking|scared|panic|help me|dread|I’m losing it|terrified|I’m so scared|I’m not okay|I can’t breathe|I’m freaking out|I feel paralyzed|I’m about to lose it|this is too much|I’m having a meltdown|my heart is racing|I’m not sure what to do|I feel trapped|I’m panicking)\b/.test(text)) {
        audio = audios.terrified;

    } else {
        audio = audios.greeting;
    }

    playAudioForDuration(audio, duration);
}

// Play audio for specified duration
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
