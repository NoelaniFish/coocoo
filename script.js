let recognition;
let statementStartTime, statementEndTime;
const statusText = document.getElementById('status');
let isRecognitionActive = false;

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
// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Please use Google Chrome for this feature.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
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
        statusText.textContent = "Error: " + event.error;
        statusText.classList.remove('listening');
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        console.log("Recognition ended.");
    };
}

// Keyword categories
const keywords = {
   homing: ["love", "friends", "besties", "pals", "amigos", "support", "hug", "calm", "comfort", "love of my life", "I love you", "marry me", "chosen family", "you mean the world", "pets", "mom", "mami", "mommy", "mama", "moms", "mother", "father", "papa", "daddy", "dad", "dads", "siblings", "doggo", "home", "meadow", "nature", "brother", "bro", "sis", "sister", "sistah", "sibling", "nonbinary", "am", "exist", "identify", "identity", "home", "house", "live", "life", "parent", "parents", "rent", "apartment", "loft", "cottage", "farm", "woods", "goats", "sheep", "cow", "horse", "ride", "solo", "lives", "cat", "meow", "dog", "woof", "coffee", "matcha", "tea", "brew", "pet", "pets", "animals", "comfort", "comfy", "rat", "lizard", "bush", "christmas", "halloween", "thanks", "giving", "tree", "support", "soft", "supportive", "blood", "heart", "family", "zen", "rake", "vacuum", "mow", "platonic", "adopt", "empathy", "grandpa", "grandma", "aunt", "neice", "nephew", "uncle", "cousin", "baby", "babies", "child", "children", "kid", "kids", "bird", "pigeon", "pigeons", "babies", "great", "son", "daughter", "toddler", "homing", "learn", "learning", "education", "school", "elementary", "high", "middle", "cool", "chill", "thought", "thoughtful", "cherish", "rescue", "beach", "grounded", "meditation", "religion", "buddhism", "mormonism", "christianity", "judaism", "jewish", "christian", "mormon", "she", "he", "they", "buddhist", "muslim", "islam", "sikhism", "Sikh", "unitarian", "universalist", "hinduism", "hindu", "taoism", "taoist", "Confucianist", "confucianism", "baptist", "catholic", "evangelical", "hang out", "spend", "together", "pray", "time", "kind", "nice", "sweet", "funny", "hilarious", "squad", "fam", "world", "earth", "planets", "Dinos", "dinosaurs", "rest", "sun", "moon", "ocean", "stars", "thought", "pray", "high", "hobbies", "hobby", "designer", "coding", "computer", "phone"],
    aggressive: ["hate", "disgust", "you disgust me", "I hate you", "fuck no", "I hate pigeons", "fuck you", "tear", "angry", "mad", "destroy", "beat down", "crush them", "burn", "cut", "kill", "murder", "rage", "furious", "break", "bitch", "damn", "fight", "pussy", "threat", "threaten", "violent", "violence", "revenge", "war", "homicide", "terrorist", "nazi", "hater", "bully", "killer", "rape", "rapist", "explode", "gun", "bomb", "genocide", "overpower", "dominate", "obliterate", "annihilate", "rage full", "wrath", "fury", "unleash", "explode", "retaliate", "yell", "scream", "shout", "vengeance", "boxing", "punch", "kick", "bruise", "ugh", "racist", "sexist", "homophobe", "ableist", "fatphobic", "pissed", "annoying", "triggered", "cancel", "cancel culture", "kamikaze", "atomic", "weapon", "destruction", "mass", "abuse", "abusive", "bulldoze", "toxic", "triggered", "agh", "eee", "errr", "no", "ugh", "shit", "alpha", "clap back"],
    defensive: ["me", "myself", "why", "why are you attacking me", "attacking", "defending", "stop", "know", "being mean", "ugly", "insecure", "go away", "because", "I’m not wrong", "wrong", "not", "you don’t understand me", "don’t", "that’s not what I meant", "I didn’t", "anything wrong", "stop blaming me", "I’m doing my best", "blame", "understand", "stop", "I only", "only", "that’s not", "wasn't my intention", "trying to help", "misunderstanding", "you do the same", "always", "never", "are you mad", "do you like me", "whatever", "fine", "misunderstand", "misunderstood", "excuse", "misinterpret", "interpret", "frightening", "fault", "overreacting", "exaggerate", "unfair", "accuse", "justify", "explain", "defend", "defense", "protect", "wrong", "intent", "joking", "sensitive", "serious", "bother", "I", "judge", "not the best"],
    mating: ["“eyes”, “hair”, “body” “smile”, “charm”, love”, “party”, “sex”, “dance”, “flirt”, “lady”, “woman”, “man”,  “hunk”, “hook up”, “cute”, “cutie” “lovely”, “take her home”, “laugh” “sexy”, ”vibe”, “flirty”, “flirtatious”, “blow”, “rim”, “booty”, “ass”, “tits”, “shake”, “twerk”, “jizz”, “come”, “coming”, “bod” “rizz”, “insane”, “dimples”, “charisma”, “bumble”, “hinge”, “fuck me”, “tinder”, “Grindr”, “penis”, “vagina”, “simp”, “bae”, “hot”, “babe”, “baby girl”, “gay”, “crush”, “Twink”, “otter”, “bear”, “boobs”, “breasts”, “chest”, “arms”, “want”, “nose”, “hands”, “fingers”, “mlm”, “sapphic”, “butch”, “try”, “great”, “futch”, “hoist”, “wet”, “moist”, “femme”, “lesbian”, “experiment”, “experimenting”, “look”, “stunning”, “gorgeous”, ""taking", "“job”, “hole”, “finger”, “out”, ""penetration", "cookie", "loving", "horny", "wink", "darling", "kiss", "“making out”", "“grind”, “grinding”, “thrust”, “thrusting”, ""sweetie", "pretty", "beautiful", "“handsome”, “good boy”, “good girl”, “good”, “seduce”, “entice”, “seduction”, “taste”, “arouse”, “arousal”, “allure”, “allured”, “desire”, “desires”, “desired”, “desiring”, “yearn”, “tempt”, “long”, “romantic”, “romance”, “in”, “attract”, “attraction”, “intimate”, “intimacy”, “playful”, “down to earth”, “angel”, “devil”, “sphinx”,, “foxy”, “sparkly”, “radiant”, “one of a kind”],
    wingwhistle: ["dangerous", "bad place", "hell", "scary", "alert", "red flag", "watch out", "run", "be careful", "suspicious", "creepy", "get out", "evacuate", "high alert", "hazardous", "trap", "brace yourself", "beware", "caution", "threat level", "sketchy", "secure the area", "heads up", "look", "ahhh", "stay away", "fast", "quick", "devastating", "protest", "injustice", "rights", "unfair", "oppression", "revolution", "enough"],
    grunt: ["freaking", "out", "shaking", "scared", "panic", "help me", "dread", "terrified", "I can’t breathe", "haunted", "losing it", "nightmare", "heart racing", "crying", "paralyzed with fear", "spooky", "distress", "horror", "freaky", "spooked", "hyperventilating", "anxiety", "trembling", "anxious", "fear", "nightmare", "control", "sick", "breathe", "death", "worry", "worried", "overthinking", "overanalyzing", "spiraling", "panic attack", "ptsd", "disorder", "mental illness", "suicide", "ideation", "fear", "fearful", "dread", "death", "fidget", "fidgety", "racing", "butterflies", "doubt", "doubtful", "what if", "oh no", "wrong", "can’t", "too much", "bad", "help me", "I’m stuck", "tragedy", "travesty", "disaster", "illness", "mental", "hospital", "doctor", "medication", "meds", "psych", "ward", "psychiatric"],
    territorial: ["possessive", "protective", "boundary", "mine", "my", "ownership", "own", "buy", "capitalism", "jealous", "envy", "envious", "guarding", "guard", "staking claim", "claim", "asserting dominance", "dominant", "not sharing", "not", "encroachment", "purchase", "shopping", "shop", "store", "money", "job", "intrusion", "limit", "limits", "belong", "belongs", "suspicious", "who", "whose", "other", "rival", "enemy", "cheating", "affair", "compare", "replace", "disgust"],

    conversational:["“hello”, “how are you”, “hi”, “hey”, “greetings”, “goodbye”, “farewell”, “pleasure”, “nice to meet you”, “how’s it going”, “good day”, “good morning”, “good afternoon”, “goodnight”, “see you”, “good evening”, “sup”, “howdy”, “y'all”, “mornin” “take care”, “how are you”, “good to see you”, “long time no see”, “hey there”, “what’s up”, “what's the weather”, “weather”, “how's”, “how” “cheers”, “peace”, “well met”, “thoughts and prayers”, “dream”, “day”, “sunshine”, “sun”, “rain”, “cloudy”, “good”, “you look good”, “yourself”, “okay”, “ok”, “so”, “sleep”, “popping”, “up”, “crackin”, “vibe”, “function”, “fam”, “dude”]
    moan:["“board” “game”, “gaming”, “fun”, “having”, “video”, “movie”, “tv”, “music”, “dance”, “art”, “museum”, “zoo”, “date”, “text”, “texting”, “communication”, “talking”, “speaking”, “gabbing”, “Talks”, “says”, “vegan”, “vegetarian”, “cooking”, “spicy”, “baking”, “making”, “dance”, “dances”, “cooks”, “cook”, “bakes”, “baker”, “artist”, “food”, “drinks”, “drunk” “alcohol”, “lamp”, “excited”, “plants”, “fashion”, “sewing”, “tango”, “salsa”, “crafting”, “knit”, “knitting”, “DJ”, “happiness”, “happy”, “podcasts”, “bonding”, “bond”, ""pookie", "babes", "sweetums", "darling", "honey", "bunch", "pie", "girly", "silly", "goofy", "joshing", "prank”, ""watch", "listen", "play"]
};

function categorizeAndRespond(text, duration) {
    let audio = audios.greeting;

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text))) {
            audio = audios[category];
            break;
        }
    }

   recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusText.textContent = "Listening...";
        statusText.classList.add('listening');
        statementStartTime = new Date().getTime();
    };
 recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        statusText.textContent = "Listening...";
        statusText.classList.add('listening');
        statementStartTime = new Date().getTime();
    };

    let currentCategory = null;
    let categoryStartTime = null;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const confidence = event.results[event.results.length - 1][0].confidence;

        if (confidence > 0.6) {
            const category = detectCategory(transcript);
            
            // Handle category changes
            if (category !== currentCategory) {
                if (currentCategory) {
                    const categoryDuration = (new Date().getTime() - categoryStartTime) / 1000;
                    categoryTimes[currentCategory] += categoryDuration;
                }
                currentCategory = category;
                categoryStartTime = new Date().getTime();
            }
        }
    };

    recognition.onspeechend = () => {
        // Stop tracking time for the last category
        if (currentCategory) {
            const categoryDuration = (new Date().getTime() - categoryStartTime) / 1000;
            categoryTimes[currentCategory] += categoryDuration;
        }
        recognition.stop();
        statusText.textContent = "Not Listening";
        statusText.classList.remove('listening');

        // Play back the audio files based on accumulated times
        playCategorizedAudio();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        statusText.textContent = "Error: " + event.error;
        statusText.classList.remove('listening');
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        console.log("Recognition ended.");
    };
}

// Detect category based on keywords
function detectCategory(text) {
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text))) {
            return category;
        }
    }
    return 'greeting';
}

// Play audio files based on the time accumulated in each category
function playCategorizedAudio() {
    for (const [category, time] of Object.entries(categoryTimes)) {
        if (time > 0) {
            console.log(`Playing ${category} for ${time} seconds.`);
            playAudioForDuration(audios[category], time);
        }
    }
}

// Play audio for a specific duration
function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, duration * 1000);
}

// Event listeners to start/stop speech recognition
document.addEventListener('mousedown', () => {
    if (!isRecognitionActive) {
        initSpeechRecognition();
        recognition.start();
        isRecognitionActive = true;
    }
});

document.addEventListener('mouseup', () => {
    if (isRecognitionActive) {
        recognition.stop();
        isRecognitionActive = false;
    }
});
