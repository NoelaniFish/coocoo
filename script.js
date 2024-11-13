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

        // Clear the previous pause timer if new input is detected
        clearTimeout(pauseTimer);

        // Start a new pause timer for 1.5 seconds
        pauseTimer = setTimeout(() => {
            recognition.stop();
            detectEmotionAndRespond(transcript);
        }, 1500); // 1.5-second pause
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

// Analyze text and play corresponding audio
function detectEmotionAndRespond(text) {
    const audioQueue = [];

    if (/hi|hello|hey/.test(text)) audioQueue.push(audios.greeting);
    if (/angry|furious|rage/.test(text)) audioQueue.push(audios.aggressive);
    if (/defensive|insecure|small/.test(text)) audioQueue.push(audios.defensive);
    if (/flirt|sexy|beautiful/.test(text)) audioQueue.push(audios.flirtatious);
    if (/care|nurture|mother/.test(text)) audioQueue.push(audios.motherly);
    if (/danger|protest|threat/.test(text)) audioQueue.push(audios.danger);
    if (/scared|terrified|petrified/.test(text)) audioQueue.push(audios.terrified);
    if (/territory|mine|protect/.test(text)) audioQueue.push(audios.territorial);

    // Play the audio sequence
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
    audio.play();

    audio.onended = () => playAudioQueue(queue);
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
