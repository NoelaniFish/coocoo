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

// Comprehensive keyword list for each category
const keywords = {
    motherly: [
        "calm", "love", "support", "hug", "I love you", "marry me", "chosen family", "love of my life", 
        "you mean the world", "you’re my everything", "soft heart", "I’m here for you", "family", "pets", 
        "rest up", "self-care", "zen", "grounded", "platonic love", "best friend", "squad", "fam", "safe", 
        "comforting", "breathe", "sunshine", "nature", "tree", "forest", "beach", "river", "sunset", 
        "flowers", "meadow", "doggo", "cat", "horse", "farm", "back home", "mother", "father", "sister", 
        "brother", "aunt", "uncle", "grandpa", "child", "daughter", "son", "toddler", "funny", "hilarious",
        "adopt", "rescue", "furry", "meow", "home sweet home", "empathy", "thoughtful", "cherish", 
        "bestie", "mommy", "mama", "daddy"
    ],
    aggressive: [
        "tear", "destroy", "rage", "cancel", "hate", "fuck no", "I hate you", "disgust me", "burn it down", 
        "wreck", "violence", "fight me", "alpha", "dominance", "stomp", "explode", "fuck off", "pissed", 
        "clap back", "annoying", "toxic", "triggered", "angry", "furious", "revenge", "bulldoze", 
        "smash", "curse", "fury", "crush"
    ],
    defensive: [
        "me", "myself", "stop", "scared", "why is this happening", "oh no", "leave me alone", 
        "I didn’t mean it", "overwhelmed", "insecure", "lost", "not good enough", "hurt", "judgment", 
        "misunderstood", "defensive", "paranoid", "annoying", "ugly", "I’m trying my best"
    ],
    flirtatious: [
        "cute", "fun", "flirt", "crush", "simp", "bae", "hot", "lesbian", "gay", "sapphic", "mlm", 
        "you look great", "gorgeous", "sexy", "stunning", "fingering", "blowjob", "glory hole", "eating out",
        "penetration", "handjob", "rimming", "goldstar", "hey mamas", "twink", "butch", "futch", "femme", 
        "cookie", "loving", "horny", "wink", "darling", "kiss", "sweetie", "you’re breathtaking"
    ],
    danger: [
        "danger", "alert", "red flag", "watch out", "run", "be careful", "suspicious", "creepy", 
        "get out", "evacuate", "high alert", "hazardous", "trap", "brace yourself", "beware", "caution", 
        "threat level", "sketchy", "secure the area"
    ],
    terrified: [
        "freaking out", "shaking", "scared", "panic", "help me", "dread", "terrified", "I can’t breathe", 
        "haunted", "losing it", "nightmare", "heart racing", "crying", "paralyzed with fear", 
        "distress", "horror", "freaky", "spooked", "hyperventilating", "anxiety", "I’m trembling"
    ]
};

// Function to categorize and respond based on keywords
function categorizeAndRespond(text, duration) {
    let audio = audios.greeting;

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            audio = audios[category];
            break;
        }
    }

    playAudioForDuration(audio, duration);
}

function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
    }, duration * 1000);
}

document.addEventListener('mousedown', () => {
    if (!recognition?.started) {
        initSpeechRecognition();
        recognition.start();
        r
