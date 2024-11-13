let recognition;
let pauseTimer = null;

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

// Initialize the speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Please use Google Chrome for this feature.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Transcript detected:", transcript);

        // Clear any existing pause timer
        clearTimeout(pauseTimer);

        // Start a timer for a 1.5-second pause
        pauseTimer = setTimeout(() => {
            recognition.stop();
            detectEmotionAndRespond(transcript);
        }, 1500);
    };

    recognition.onerror = (event) => {
        console.error("Error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => restartRecognition();

    recognition.start();
}

// Restart recognition
function restartRecognition() {
    setTimeout(() => {
        try {
            recognition.start();
        } catch (error) {
            console.error("Error restarting recognition:", error);
        }
    }, 500);
}

// Detect emotions and respond with appropriately timed audio
function detectEmotionAndRespond(text) {
    const durations = getEmotionDurations(text);
    const audioQueue = [];

    // Prepare audio responses based on detected emotions and durations
    for (const [emotion, duration] of Object.entries(durations)) {
        const audio = audios[emotion];
        if (audio) {
            const adjustedAudio = adjustAudioDuration(audio, duration);
            audioQueue.push(adjustedAudio);
        }
    }

    playAudioQueue(audioQueue);
}

// Analyze text and estimate durations for each emotion
function getEmotionDurations(text) {
    const words = text.split(" ");
    const totalWords = words.length;

    const emotions = {
        greeting: /hi|hello|hey/,
        aggressive: /angry|furious|rage/,
        defensive: /defensive|insecure|small/,
        flirtatious: /flirt|sexy|beautiful/,
        motherly: /care|nurture|mother/,
        danger: /danger|protest|threat/,
        terrified: /scared|terrified|petrified/,
        territorial: /territory|mine|protect/
    };

    const durations = {};

    for (const [emotion, regex] of Object.entries(emotions)) {
        const matchedWords = words.filter(word => regex.test(word)).length;
        const duration = (matchedWords / totalWords) * getTotalDuration(text);
        if (duration > 0) durations[emotion] = duration;
    }

    return durations;
}

// Estimate the total duration of the speech in seconds
function getTotalDuration(text) {
    const wordsPerMinute = 130; // Average speaking rate
    const totalWords = text.split(" ").length;
    return (totalWords / wordsPerMinute) * 60;
}

// Adjust the audio duration by changing its playback rate
function adjustAudioDuration(audio, duration) {
    const originalDuration = audio.duration;
    
    // Adjust playback rate to fit the desired duration
    if (originalDuration > 0) {
        audio.playbackRate = originalDuration / duration;
    }

    return audio;
}

// Play the queued audio files sequentially
function playAudioQueue(queue) {
    if (queue.length === 0) {
        restartRecognition();
        return;
    }

    const audio = queue.shift();
    audio.currentTime = 0;
    audio.play();

    audio.onended = () => playAudioQueue(queue);
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
