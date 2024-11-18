let isSpacebarPressed = false; // Track spacebar state
let speechRecognition = null;
let isListening = false;
const statusDisplay = document.getElementById('statusText');

// Track category durations
const categoryDurations = {
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
const audioFiles = {
    conversational: new Audio('conversational.mp3'),
    homing: new Audio('homing.mp3'),
    aggressive: new Audio('aggressive.mp3'),
    defensive: new Audio('defensive.mp3'),
    mating: new Audio('mating.mp3'),
    grunt: new Audio('grunt.mp3'),
    wingwhistle: new Audio('wingwhistle.mp3'),
    territorial: new Audio('territorial.mp3')
};

// Audio queue management
let audioQueue = [];
let isAudioPlaying = false;

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';

    speechRecognition.onstart = () => {
        console.log("Listening...");
        statusDisplay.textContent = "Listening...";
    };

    speechRecognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
        console.log("Recognized:", transcript);
        handleSpeech(transcript, 2); // Example duration
    };

    speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening();
    };

    speechRecognition.onend = () => {
        console.log("Stopped listening");
        statusDisplay.textContent = "Not Listening";
        isListening = false;
    };
}

// Start listening
function startListening() {
    if (speechRecognition && !isListening) {
        speechRecognition.start();
        isListening = true;
        statusDisplay.textContent = "Listening...";
    }
}

// Stop listening
function stopListening() {
    if (speechRecognition && isListening) {
        speechRecognition.stop();
        isListening = false;
        statusDisplay.textContent = "Not Listening";
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

// Handle recognized speech
function handleSpeech(text, duration) {
    let matchedCategory = null;
    let highestMatchCount = 0;

    for (const [category, words] of Object.entries(keywordCategories)) {
        let matchCount = words.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0);
        if (matchCount > highestMatchCount) {
            highestMatchCount = matchCount;
            matchedCategory = category;
        }
    }

    if (matchedCategory) {
        console.log(`Category matched: ${matchedCategory}`);
        playAudioForCategory(matchedCategory, duration);
        categoryDurations[matchedCategory] += duration;
    } else {
        console.log("No category matched, playing default.");
        playAudioForCategory('conversational', duration);
    }
}

// Play audio based on category
function playAudioForCategory(category, duration) {
    const audio = audioFiles[category];
    if (audio) addAudioToQueue(audio, duration);
}

function addAudioToQueue(audio, duration) {
    audioQueue.push({ audio, duration });
    if (!isAudioPlaying) playNextInQueue();
}

function playNextInQueue() {
    if (audioQueue.length === 0) {
        isAudioPlaying = false;
        return;
    }

    isAudioPlaying = true;
    const { audio, duration } = audioQueue.shift();
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
        audio.pause();
        playNextInQueue();
    }, duration * 1000);
}

// Spacebar controls for starting/stopping recognition
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isSpacebarPressed) {
        event.preventDefault();
        isSpacebarPressed = true;

        if (!isListening) {
            initializeSpeechRecognition();
            startListening();
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        isSpacebarPressed = false;

        if (isListening) {
            stopListening();
        }
    }
});

// Ensure initialization when the page loads
window.addEventListener('load', initializeSpeechRecognition);
