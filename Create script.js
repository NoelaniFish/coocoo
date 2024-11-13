let recognition;
let greetingAudio, aggressiveAudio, defensiveAudio, flirtatiousAudio;
let motherlyAudio, dangerAudio, terrifiedAudio, territorialSoftAudio;

function preloadAudios() {
    greetingAudio = new Audio('coo-greeting.mp3');
    aggressiveAudio = new Audio('aggressive-territorial.mp3');
    defensiveAudio = new Audio('defensive.mp3');
    flirtatiousAudio = new Audio('flirtatious.mp3');
    motherlyAudio = new Audio('motherly-nuturing.mp3');
    dangerAudio = new Audio('potential-danger.mp3');
    terrifiedAudio = new Audio('terrified-petrified-grunts.mp3');
    territorialSoftAudio = new Audio('territorial-soft.mp3');
}

// Load the audio files on page load
preloadAudios();

function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Chrome.");
        return;
    }
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        document.getElementById('transcript').innerText = "Listening...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById('transcript').innerText = `You said: ${transcript}`;
        handleSpeechInput(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        document.getElementById('transcript').innerText = "Speak to the bot...";
    };
}

function handleSpeechInput(text) {
    if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        playAudio(greetingAudio);
    } else if (text.includes("angry") || text.includes("furious") || text.includes("rage")) {
        playAudio(aggressiveAudio);
    } else if (text.includes("defensive") || text.includes("insecure") || text.includes("small")) {
        playAudio(defensiveAudio);
    } else if (text.includes("flirt") || text.includes("sexy") || text.includes("beautiful")) {
        playAudio(flirtatiousAudio);
    } else if (text.includes("care") || text.includes("nurture") || text.includes("mother")) {
        playAudio(motherlyAudio);
    } else if (text.includes("danger") || text.includes("protest") || text.includes("threat")) {
        playAudio(dangerAudio);
    } else if (text.includes("scared") || text.includes("terrified") || text.includes("petrified")) {
        playAudio(terrifiedAudio);
    } else if (text.includes("territory") || text.includes("mine") || text.includes("protect")) {
        playAudio(territorialSoftAudio);
    } else {
        console.log("No matching audio for this input.");
    }
}

function playAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

document.getElementById('start-btn').addEventListener('click', () => {
    recognition.start();
});

initSpeechRecognition();
