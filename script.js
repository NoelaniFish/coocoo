let recognition = null;
let isRecognitionActive = false;
let statementStartTime = 0;
let statementEndTime = 0;
const statusText = document.getElementById('statusText'); // Make sure there's an element with this ID

const categoryTimes = {
    conversational: 0,
    homing: 0,
    aggressive: 0,
    defensive: 0,
    mating: 0,
    grunt: 0,
    wingwhistle: 0,
    territorial: 0
};

// Load audio files
const audios = {
    conversational: new Audio('conversational.mp3'),
    homing: new Audio('homing.mp3'),
    aggressive: new Audio('aggressive.mp3'),
    defensive: new Audio('defensive.mp3'),
    mating: new Audio('mating.mp3'),
    grunt: new Audio('grunt.mp3'),
    wingwhistle: new Audio('wingwhistle.mp3'),
    territorial: new Audio('territorial.mp3')
};
// Queue to store sounds to play sequentially
let audioQueue = [];
let isPlaying = false;

// Function to initialize speech recognition and request microphone access
async function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Google Chrome.");
        return;
    }

    try {
        console.log("Requesting microphone access...");
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted.");
        startRecognition();
    } catch (error) {
        console.error("Microphone access denied:", error);
        alert("Microphone access is required to use this feature.");
    }
}

// Function to start speech recognition
function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log("Speech recognition started");
        statusText.textContent = "Listening...";
        statusText.classList.add('listening');
        statementStartTime = new Date().getTime();
    };

    recognition.onresult = (event) => {
        statementEndTime = new Date().getTime();
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Recognized text:", transcript);
        const confidence = event.results[0][0].confidence;

        if (confidence > 0.6 && transcript.trim().length > 5) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        }
    };

    recognition.onspeechend = () => {
        console.log("Speech ended");
        stopRecognition();
        playCategorizedAudio();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        statusText.textContent = "Error: " + event.error;
        statusText.classList.remove('listening');
        stopRecognition();
    };

    recognition.onend = () => {
        console.log("Speech recognition ended");
        isRecognitionActive = false;
        statusText.textContent = "Not Listening";
        statusText.classList.remove('listening');
    };

    recognition.start();
    console.log("Recognition started");
}

// Function to stop recognition
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        statusText.textContent = "Not Listening";
        statusText.classList.remove('listening');
        console.log("Recognition stopped");
    }
}
// Keyword categories
const keywords = {
   homing: ["love", "friends", "left", "red", "blue", "yellow", "orange", "black", "brown", "purple", "grass", "bug", "white", "yep", "besties", "pals", "amigos", "support", "hug", "calm", "comfort", "love of my life", "I love you", "marry me", "chosen family", "you mean the world", "pets", "mom", "mami", "mommy", "mama", "moms", "mother", "father", "papa", "daddy", "dad", "dads", "siblings", "doggo", "home", "meadow", "nature", "brother", "bro", "sis", "sister", "sistah", "sibling", "nonbinary", "am", "exist", "identify", "identity", "home", "house", "live", "life", "parent", "parents", "rent", "apartment", "loft", "cottage", "farm", "woods", "goats", "sheep", "cow", "horse", "ride", "solo", "lives", "cat", "meow", "dog", "woof", "coffee", "matcha", "tea", "brew", "pet", "pets", "animals", "comfort", "comfy", "rat", "lizard", "bush", "christmas", "halloween", "thanks", "giving", "tree", "support", "soft", "supportive", "blood", "heart", "family", "zen", "rake", "vacuum", "mow", "platonic", "adopt", "empathy", "grandpa", "grandma", "aunt", "neice", "nephew", "uncle", "cousin", "baby", "babies", "child", "children", "kid", "kids", "bird", "pigeon", "pigeons", "babies", "great", "son", "daughter", "toddler", "homing", "learn", "learning", "education", "school", "elementary", "high", "middle", "cool", "chill", "thought", "thoughtful", "cherish", "rescue", "beach", "grounded", "meditation", "religion", "buddhism", "mormonism", "christianity", "judaism", "jewish", "christian", "mormon", "she", "he", "they", "buddhist", "muslim", "islam", "sikhism", "Sikh", "unitarian", "universalist", "hinduism", "hindu", "taoism", "taoist", "Confucianist", "confucianism", "baptist", "catholic", "evangelical", "hang out", "spend", "together", "pray", "time", "kind", "nice", "sweet", "funny", "hilarious", "squad", "fam", "world", "earth", "planets", "Dinos", "dinosaurs", "rest", "sun", "moon", "ocean", "stars", "thought", "pray", "high", "hobbies", "hobby", "designer", "coding", "computer", "phone"],
    aggressive: ["hate", "disgust", "you disgust me", "I hate you", "fuck no", "I hate pigeons", "fuck you", "tear", "angry", "mad", "destroy", "beat down", "crush them", "burn", "cut", "kill", "murder", "rage", "furious", "break", "bitch", "damn", "fight", "pussy", "threat", "threaten", "violent", "violence", "revenge", "war", "homicide", "terrorist", "nazi", "hater", "bully", "killer", "rape", "rapist", "explode", "gun", "bomb", "genocide", "overpower", "dominate", "obliterate", "annihilate", "rage full", "wrath", "fury", "unleash", "explode", "retaliate", "yell", "scream", "shout", "vengeance", "boxing", "punch", "kick", "bruise", "ugh", "racist", "sexist", "homophobe", "ableist", "fatphobic", "pissed", "annoying", "triggered", "cancel", "cancel culture", "kamikaze", "atomic", "weapon", "destruction", "mass", "abuse", "abusive", "bulldoze", "toxic", "triggered", "agh", "eee", "errr", "no", "ugh", "shit", "alpha", "clap back"],
    defensive: ["me", "change", "deoderant", "perfume", "makeup", "stinky", "smelly", "lazy", "productive", "busy", "chaotic", "myself", "why", "why are you attacking me", "attacking", "defending", "stop", "know", "being mean", "ugly", "insecure", "go away", "because", "I’m not wrong", "wrong", "not", "you don’t understand me", "don’t", "that’s not what I meant", "I didn’t", "anything wrong", "stop blaming me", "I’m doing my best", "blame", "understand", "stop", "I only", "only", "that’s not", "wasn't my intention", "trying to help", "misunderstanding", "you do the same", "always", "never", "are you mad", "do you like me", "whatever", "fine", "misunderstand", "misunderstood", "excuse", "misinterpret", "interpret", "frightening", "fault", "overreacting", "exaggerate", "unfair", "accuse", "justify", "explain", "defend", "defense", "protect", "wrong", "intent", "joking", "sensitive", "serious", "bother", "I", "judge", "not the best"],
    mating: ["eyes", "sexy", "blush", "freckles", "butt", "ass", "dick", "clit", "publes", "eyelashes", "lips", "sticky", "gooey", "limerence", "hairy", "screw", "hair", "body", "smile", "charm", "love", "party", "sex", "dance", "flirt", "lady", "woman", "man", "hunk", "hook up", "cute", "cutie", "lovely", "take her home", "laugh", "sexy", "vibe", "flirty", "flirtatious", "blow", "rim", "booty", "ass", "tits", "shake", "twerk", "jizz", "come", "coming", "bod", "rizz", "insane", "dimples", "charisma", "bumble", "hinge", "fuck me", "tinder", "Grindr", "penis", "vagina", "simp", "bae", "hot", "babe", "baby girl", "gay", "crush", "Twink", "otter", "bear", "boobs", "breasts", "chest", "arms", "want", "nose", "hands", "fingers", "mlm", "sapphic", "butch", "try", "great", "futch", "hoist", "wet", "moist", "femme", "lesbian", "experiment", "experimenting", "look", "stunning", "gorgeous", "taking", "job", "hole", "finger", "out", "penetration", "cookie", "loving", "horny", "wink", "darling", "kiss", "making out", "grind", "grinding", "thrust", "thrusting", "sweetie", "pretty", "beautiful", "handsome", "good boy", "good girl", "good", "seduce", "entice", "seduction", "taste", "arouse", "arousal", "allure", "allured", "desire", "desires", "desired", "desiring", "yearn", "tempt", "long", "romantic", "romance", "in", "attract", "attraction", "intimate", "intimacy", "playful", "down to earth", "angel", "devil", "sphinx", "foxy", "sparkly", "radiant", "one of a kind"],
    wingwhistle: ["dangerous", "bad place", "hell", "nope", "scary", "alert", "red flag", "watch out", "run", "be careful", "suspicious", "creepy", "get out", "evacuate", "high alert", "hazardous", "trap", "brace yourself", "beware", "caution", "threat level", "sketchy", "secure the area", "heads up", "look", "ahhh", "stay away", "fast", "quick", "devastating", "protest", "injustice", "rights", "unfair", "oppression", "revolution", "enough"],
    grunt: ["freaking", "out", "shaking", "scared", "panic", "help me", "dread", "cannot", "terrified", "I can’t breathe", "haunted", "losing it", "nightmare", "heart racing", "crying", "paralyzed with fear", "spooky", "distress", "horror", "freaky", "spooked", "hyperventilating", "anxiety", "trembling", "anxious", "fear", "nightmare", "control", "sick", "breathe", "death", "worry", "worried", "overthinking", "overanalyzing", "spiraling", "panic attack", "ptsd", "disorder", "mental illness", "suicide", "ideation", "fear", "fearful", "dread", "death", "fidget", "fidgety", "racing", "butterflies", "doubt", "doubtful", "what if", "oh no", "wrong", "can’t", "too much", "bad", "help me", "I’m stuck", "tragedy", "travesty", "disaster", "illness", "mental", "hospital", "doctor", "medication", "meds", "psych", "ward", "psychiatric"],
    territorial: ["possessive", "protective", "protect", "boundaries", "owns", "shield", "guide", "boundary", "mine", "my", "ownership", "own", "buy", "capitalism", "jealous", "envy", "envious", "guarding", "guard", "staking claim", "claim", "asserting dominance", "dominant", "not sharing", "not", "encroachment", "purchase", "shopping", "shop", "store", "money", "job", "intrusion", "limit", "limits", "belong", "belongs", "suspicious", "who", "whose", "other", "rival", "enemy", "cheating", "affair", "compare", "replace", "disgust"],
   conversational: ["hello", "figure", "how are you", "hi", "hey", "greetings", "goodbye", "farewell", "pleasure", "nice to meet you", "how’s it going", "good day", "good morning", "good afternoon", "goodnight", "see you", "good evening", "sup", "howdy", "y'all", "mornin", "take care", "how are you", "good to see you", "long time no see", "hey there", "what’s up", "what's the weather", "weather", "how's", "how", "cheers", "peace", "well met", "thoughts and prayers", "dream", "day", "sunshine", "sun", "rain", "cloudy", "good", "you look good", "yourself", "okay", "ok", "so", "sleep", "popping", "up", "crackin", "vibe", "function", "fam", "dude"],
    moan: ["board", "game", "can","do", "community", "mutual", "aid", "back", "zealous", "reciprocate", "reciprocation", "heaven", "gaming", "enjoy", "fun", "having", "video", "correct", "right",  "movie", "tv", "music", "dance", "art", "museum", "zoo", "date", "text", "texting", "communication", "talking", "speaking", "gabbing", "Talks", "says", "vegan", "vegetarian", "cooking", "spicy", "baking", "making", "dance", "dances", "cooks", "cook", "bakes", "baker", "artist", "food", "drinks", "drunk", "alcohol", "lamp", "excited", "plants", "fashion", "sewing", "tango", "salsa", "crafting", "knit", "knitting", "DJ", "happiness", "happy", "podcasts", "bonding", "bond", "pookie", "babes", "sweetums", "darling", "honey", "bunch", "pie", "girly", "silly", "goofy", "joshing", "prank", "watch", "listen", "play"]

};

// Function to categorize and respond based on recognized text
function categorizeAndRespond(text, duration) {
    let matchedCategory = null;
    let highestMatchCount = 0;

    for (const [category, words] of Object.entries(keywords)) {
        let matchCount = 0;
        for (const word of words) {
            if (new RegExp(`\\b${word}\\b`, 'i').test(text)) {
                matchCount++;
            }
        }
        if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            matchedCategory = category;
        }
    }

    if (matchedCategory) {
        console.log(`Matched category: ${matchedCategory}`);
        addToQueue(audios[matchedCategory], duration);
        categoryTimes[matchedCategory] += duration;
    } else {
        console.log("No matching category found. Playing default.");
        addToQueue(audios.conversational, duration);
    }
}

function addToQueue(audio, duration) {
    audioQueue.push({ audio, duration });
    if (!isPlaying) playNextInQueue();
}

function playNextInQueue() {
    if (audioQueue.length === 0) {
        isPlaying = false;
        return;
    }

    isPlaying = true;
    const { audio, duration } = audioQueue.shift();
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
        audio.pause();
        playNextInQueue();
    }, duration * 1000);
}

// Event listeners for spacebar
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isRecognitionActive) {
        initSpeechRecognition();
        isRecognitionActive = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' && isRecognitionActive) {
        stopRecognition();
        isRecognitionActive = false;
    }
});
