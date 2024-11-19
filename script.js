let recognition;
let isRecognitionActive = false;
const statusText = document.getElementById('status');

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
const keywords = {
   homing: ["love", "friends", "left", "red", "blue", "yellow", "orange", "black", "brown", "purple", "grass", "bug", "white", "yep", "besties", "pals", "amigos", "support", "hug", "calm", "comfort", "love of my life", "I love you", "marry me", "chosen family", "age", "turn", "ages","turns", "sleeps","sleep", "you mean the world", "pets", "mom", "mami", "mommy", "mama", "moms", "mother", "father", "papa", "daddy", "dad", "dads", "siblings", "doggo", "home", "meadow", "works", "united", "states", "cheap", "cheaper", "faces", "varieties", "study", "brain", "studies", "bricks", "edm", "jazz", "classic", "classical", "pop", "hip", "hop", "cliff", "file", "set", "up", "down", "step", "city", "70", "work", "france", "america", "working", "female", "male", "hours", "academic", "day", "profession", "floor", "ceiling", "groud", "nest", "egg", "nests", "eggs", "glass", "plastic", "nature", "brother", "poop", "pant", "pants", "shirt", "hat", "cap", "healthy", "bro", "sis", "sister", "sistah", "sibling", "nonbinary", "am", "exist", "kitten", "one", "two", "3", "4", "5", "6", "7", "8", "9", "10", "20", "100", "million", "hundreds", "thousands", "seconds", "miutes", "hours", "time", "speed", "spending", "someone","feline", "tiger", "lion", "identify", "identity", "home", "house", "live", "life", "parent", "frienship", "companion", "companionship", "parents", "rent", "apartment", "loft", "cottage", "farm", "woods", "goats", "pros", "cons", "sheep", "cow", "horse", "feathers", "feet", "talons", "avian", "ornithology", "ride", "solo", "lives", "cat", "meow", "dog", "woof", "coffee", "matcha", "tea", "brew", "pet", "pets", "animals", "comfort", "comfy", "rat", "lizard", "bush", "christmas", "halloween", "thanks", "giving", "tree", "support", "soft", "supportive", "blood", "heart", "family", "zen", "rake", "vacuum", "mow", "platonic", "adopt", "empathy", "grandpa", "grandma", "aunt", "neice", "nephew", "uncle", "cousin", "baby", "babies", "child", "children", "kid", "kids", "bird", "pigeon", "pigeons", "babies", "great", "son", "daughter", "toddler", "homing", "learn", "learning", "education", "school", "elementary", "high", "middle", "cool", "chill", "thought", "thoughtful", "cherish", "rescue", "beach", "grounded", "meditation", "religion", "buddhism", "mormonism", "christianity", "judaism", "jewish", "christian", "mormon", "she", "he", "they", "buddhist", "muslim", "islam", "sikhism", "Sikh", "unitarian", "universalist", "hinduism", "hindu", "jew", "jews", "chew", "toy", "play", "colors", "colorful", "rainbow", "math", "english", "language", "walk", "run", "fly", "flies", "wing", "beak", "gray", "silver", "here",  "taoism", "taoist", "Confucianist", "confucianism", "baptist", "catholic", "evangelical", "hang out", "spend", "together", "pray", "time", "kind", "nice", "sweet", "funny", "hilarious", "squad", "fam", "world", "earth", "planets", "Dinos", "dinosaurs", "rest", "sun", "moon", "ocean", "rides", "gallop", "gallops", "stars", "thought", "pray", "high", "hobbies", "hobby", "designer", "coding", "computer", "phone"],
    aggressive: ["hate", "disgust", "you disgust me", "I hate you", "fuck no", "I hate pigeons", "fuck you", "tear", "angry", "mad", "destroy", "beat down", "crush them", "burn", "cut", "kill", "murder", "rage", "furious", "break", "bitch", "damn", "fight", "pussy", "threat", "threaten", "violent", "violence", "revenge", "war", "homicide", "terrorist", "nazi", "hater", "bully", "killer", "rape", "rapist", "explode", "gun", "messy", "allergic", "allergy", "bomb", "diseases", "genocide", "overpower", "dominate", "stomp", "obliterate", "annihilate", "rage full", "snake", "wrath", "fury", "unleash", "explode", "retaliate", "yell", "scream", "shout", "vengeance", "boxing", "punch", "kick", "bruise", "bite", "peck", "dust", "dusty", "require", "ugh", "racist", "sexist", "homophobe", "messy", "ableist", "fatphobic", "pissed", "annoying", "triggered", "cancel", "cancel culture", "kamikaze", "atomic", "weapon", "destruction", "mass", "abuse", "abusive", "bulldoze", "toxic", "triggered", "agh", "eee", "errr", "no", "ugh", "shit", "alpha", "clap back"],
    defensive: ["me", "change", "deoderant", "perfume", "makeup", "stinky", "smelly", "lazy", "productive", "busy", "chaotic", "myself", "why", "why are you attacking me", "attacking", "defending", "stop", "know", "being mean", "ugly", "insecure", "go away", "because", "I’m not wrong", "wrong", "not", "you don’t understand me", "don’t", "that’s not what I meant", "I didn’t", "anything wrong", "stop blaming me", "I’m doing my best", "need", "needs", "cry", "solo", "lonely", "sob", "joke", "jokes", "haha", "hehe", "whoa", "wow" "tear", "tears", "blame", "understand", "stop", "I only", "only", "that’s not", "wasn't my intention", "trying to help", "misunderstanding", "you do the same", "always", "never", "are you mad", "do you like me", "whatever", "fine", "misunderstand", "misunderstood", "excuse", "misinterpret", "interpret", "frightening", "fault", "overreacting", "exaggerate", "unfair", "accuse", "justify", "explain", "defend", "defense", "protect", "wrong", "intent", "joking", "sensitive", "serious", "bother", "I", "judge", "not the best"],
    mating: ["eyes", "sexy", "blush", "freckles", "bdsm", "bondage", "tied","rope", "gag", "seduces", "entrance", "entrances", "capture", "captures", "hold", "holds", "butt", "ass", "dick", "clit", "publes", "eyelashes", "lips", "sticky", "gooey", "limerence", "hairy", "screw", "hair", "body", "smile", "charm", "love", "party", "sex", "dance", "flirt", "lady", "woman", "man", "hunk", "hook up", "cute", "cutie", "lovely", "take her home", "laugh", "sexy", "vibe", "flirty", "flirtatious", "blow", "rim", "booty", "ass", "tits", "want", "wants", "devote", "devoting", "devotes",  "serve", "shake", "twerk", "jizz", "come", "coming", "bod", "rizz", "insane", "dimples", "charisma", "bumble", "hinge", "fuck me", "tinder", "else", "stranger", "lover", "dating", "hooking", "ecstasy", "blowing", "Grindr", "penis", "vagina", "simp", "bae", "hot", "babe", "baby girl", "gay", "crush", "Twink", "otter", "bear", "boobs", "breasts", "chest", "arms", "want", "nose", "hands", "fingers", "mlm", "sapphic", "butch", "try", "great", "futch", "hoist", "wet", "moist", "femme", "lesbian", "experiment", "experimenting", "look", "stunning", "gorgeous", "taking", "job", "hole", "finger", "out", "penetration", "cookie", "loving", "horny", "wink", "darling", "kiss", "making out", "grind", "grinding", "thrust", "thrusting", "sweetie", "pretty", "beautiful", "handsome", "good boy", "good girl", "good", "seduce", "entice", "seduction", "taste", "arouse", "arousal", "allure", "allured", "desire", "desires", "desired", "desiring", "yearn", "tempt", "long", "romantic", "romance", "in", "attract", "attraction", "intimate", "intimacy", "playful", "need", "needs", "needed", "needing", "down to earth", "angel", "devil", "sphinx", "foxy", "sparkly", "radiant", "one of a kind"],
    wingwhistle: ["dangerous", "red alert", "not good", "i'm scared", "not again", "for real", "bad place", "hell", "nope", "scary", "alert", "red flag", "watch out", "run","runs", "screams", "shriek", "shrieks", "shrieking","surprised" "running", "be careful", "sus", "suspicious", "heeby", "jeebies", "creepy", "get out", "evacuate", "high alert", "hazardous", "trapping", "traps", "trap", "brace yourself", "beware", "caution", "threat level", "sketchy", "secure the area", "heads up", "look", "ahhh", "stay away", "fast", "quick", "devastating", "protest", "protests", "protesting",  "injustice", "rights", "unfair", "vet", "doctor", "doctors", "nurses", "oppression", "challenge", "resiliet", "sufficient", "revolution", "enough"],
    grunt: ["freaking", "out", "shaking", "scared", "panic", "help me", "dread", "cannot", "terrified", "I can’t breathe", "haunted", "losing it", "nightmare", "heart racing", "crying", "paralyzed with fear", "spooky", "distress", "horror", "freaky", "spooked", "hyperventilating", "anxiety", "trembling", "anxious", "fear", "nightmare", "control", "sick", "breathe", "death", "worry", "worried", "overthinking", "overanalyzing", "spiraling", "panic attack", "ptsd", "disorder", "mental illness", "suicide", "ideation", "fear", "fearful", "dread", "death", "fidget", "fidgety", "racing", "butterflies", "doubt", "doubtful", "what if", "oh no", "wrong", "can’t", "too much", "bad", "help me", "I’m stuck", "forgive", "sorry", "forgiven", "tragedy", "travesty", "disaster", "illness", "mental", "hospital", "doctor", "medication", "meds", "psych", "ward", "psychiatric"],
    territorial: ["possessive", "protective", "protect", "boundaries", "owns", "shield", "guide", "boundary", "mine", "my", "ownership", "own", "buy", "capitalism", "jealous", "envy", "envious", "guarding", "guard", "staking claim", "claim", "asserting dominance", "dominant", "not sharing", "not", "encroachment", "purchase", "shopping", "shop", "store", "money", "job", "intrusion", "limit", "limits", "belong", "belongs",  "suspicious", "who", "insecurity", "insecurities", "whose", "other", "rival", "enemy", "cheating", "affair", "compare", "replace", "disgust"],
   conversational: ["hello", "figure", "how are you", "hi", "hey", "greetings", "goodbye", "farewell", "pleasure", "nice to meet you", "how’s it going", "good day", "good morning", "good afternoon", "goodnight", "see you", "good evening", "sup", "howdy", "y'all", "mornin", "take care", "how are you", "good to see you", "long time no see", "hey there", "what’s up", "what's the weather", "weather", "how's", "how", "cheers", "peace", "well met", "thoughts and prayers", "dream", "day", "sunshine", "like", "sun", "rain", "cloudy", "good", "you look good", "yourself", "okay", "ok", "so", "sleep", "popping", "up", "crackin", "wait", "waiting", "waits", "vibe", "function", "fam", "dude"],
    moan: ["board", "game", "can","do", "community", "mutual", "meat", "salmon", "chicken", "fish", "sushi", "juice", "coffee", "matcha", "chai", "tea", "herbal", "caffeine", "caffeinated", "uncaffeinated", "over", "plane", "tri", "vacation", "funeral", "birthday", "party", "parties", "celebrate", "woo", "hoo", "dessert", "icecream", "cream", "wait", "cuddle", "carress", "aid", "back", "zealous", "reciprocate", "reciprocation", "heaven", "gaming", "enjoy", "fun", "having", "video", "correct", "right",  "movie", "tv", "music", "dance", "art", "museum", "zoo", "date", "text", "texting", "communication", "talking", "speaking", "gabbing", "Talks", "says", "vegan", "vegetarian", "cooking", "spicy", "baking", "making", "dance", "dances", "cooks", "companions", "domesticate", "secured", "secure", "company", "safe", "warm", "mate", "monogamous", "purr", "poly", "polyamorous","contact",  "exercise", "gym", "rowing", "boxing", "vr", "fencing", "stores", "seeds", "crumbs", "onions", "garlic", "smells good", "tasty", "delish", "beer", "shot", "drinking", "drunk", "wine", "craft", "crafting", "rave", "water", "sports", "soccer", "molly", "shrooms", "mushrooms", "soccer", "drugs", "weed", "lemon", "lime", "lemonade", "paiting", "drawing", "crochet", "knit", "knitting", "crocheting", "gin", "tequila", "vodka", "rum", "malibu", "delicious", "cook", "bakes", "soda", "cookies", "bread", "butter",  "baker", "artist", "food", "drinks", "drunk", "alcohol", "lamp", "excited", "plants", "fashion", "sewing", "tango", "salsa", "crafting", "knit", "knitting", "DJ", "happiness", "happy", "podcasts", "bonding", "bond", "pookie", "babes", "sweetums", "darling", "honey", "bunch", "pie", "girly", "silly", "goofy", "joshing", "prank", "watch", "listen", "play"]

};

// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Google Chrome.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusText.textContent = "Listening...";
        console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const confidence = event.results[event.results.length - 1][0].confidence;

        if (confidence > 0.6) {
            console.log("Transcript:", transcript);
            processTranscript(transcript, transcript.length);
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        statusText.textContent = `Error: ${event.error}`;
    };

    recognition.onend = () => {
        console.log("Speech recognition ended.");
        statusText.textContent = "Press and hold the spacebar to record...";
        isRecognitionActive = false;
    };
}

// Process the transcript and play corresponding audio
function processTranscript(transcript, transcriptLength) {
    let matchedCategory = 'conversational'; // Default to conversational
    const duration = Math.max(1, Math.ceil(transcriptLength / 5)); // Estimate duration based on words

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => transcript.includes(word))) {
            matchedCategory = category;
            break;
        }
    }

    categoryDurations[matchedCategory] += duration;
    console.log(`Matched Category: ${matchedCategory}, Duration: ${duration} seconds`);
    playAudio(audioFiles[matchedCategory], duration);
}

// Play audio for the specified duration
function playAudio(audio, duration) {
    if (audio) {
        const clonedAudio = audio.cloneNode();
        clonedAudio.play();
        setTimeout(() => {
            clonedAudio.pause();
            clonedAudio.currentTime = 0;
        }, duration * 1000);
    }
}

// Start/Stop speech recognition with the spacebar
function handleKeydown(event) {
    if (event.code === 'Space' && !isRecognitionActive) {
        event.preventDefault();
        startRecognition();
    }
}

function handleKeyup(event) {
    if (event.code === 'Space' && isRecognitionActive) {
        event.preventDefault();
        stopRecognition();
    }
}

function startRecognition() {
    if (recognition) {
        recognition.start();
        isRecognitionActive = true;
    }
}

function stopRecognition() {
    if (recognition && isRecognitionActive) {
        recognition.stop();
        isRecognitionActive = false;
        statusText.textContent = "Recognition stopped. Press and hold the spacebar to record again.";
    }
}

// Initialize speech recognition and event listeners on page load
window.onload = () => {
    initSpeechRecognition();
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
};
