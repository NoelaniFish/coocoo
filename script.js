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

        console.log("Transcript:", transcript);
        console.log("Confidence:", confidence);

        if (confidence > 0.5) {
            const duration = (statementEndTime - statementStartTime) / 1000;
            categorizeAndRespond(transcript, duration);
        } else {
            console.log("Low confidence, defaulting to greeting.");
            playAudioForDuration(audios.greeting, 2);
        }
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        restartRecognition();
    };

    recognition.onend = () => {
        console.log("Recognition ended.");
    };

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
    }, 1000);
}

// Categorize speech and respond
function categorizeAndRespond(text, duration) {
    let audio;

    // **Greeting (Coo-Greeting)**
    if (/hi|hello|hey|good day| goin | honey | pookie |  sweetie | hows it | dawn | misty |  weather |  hows the |  miss you | nice to see you | bye | see ya | morning | afternoon| goodnight | night | pleasure to meet|greetings|how do you fare|lovely to see|salutations|well met|peace upon you|farewell|take care|goodbye| may joy accompany/.test(text)) {
        audio = audios.greeting;

    // **Motherly-Nurturing**
    } else if (/calm|green|bloom|growing| care |  i care |  i love |  how are |  are you |  are you really |  i really do |  sound of |  family |  friend |  friendship| peace |  gentle|  nice |  kind |  sweet|  funny| hilzarious|  weird|  musical| community | mutual| mutual aid |  aid|  help|  helping |  helping hand |  sacrafice|   beautiful| sunset|morning light|gentle rain|home|hug|support|laughter|family|bond|forever|best friend|chill|bond/.test(text) ||
               /peaceful|trees feel alive| sledding | snow man |  snow |  ice |  snowflake | sun | moon |  warmth | warm |  cold cool | cool | cold | alive | cats| cat| dog| lizard | chicken| farm | home | hometown | goats| horses | sheep| cows|  trees| beach|  ocean|  land| outside |  nature|  grass | winter |  fall| summer | spring|  autumn |  leaves | mother |  father |  mom|  dad|  sister |  brother |  cousin|  aunt |  uncle | grandpa| grandma | second | third | first | deal | brgain | religion | christian | jewish | catholic|baptistc|buddhist| pets| smell of rain|boo | sunset is like a deep breath|sound of waves|you’re my rock|family sticks together|proud of you/.test(text)) {
        audio = audios.motherly;

    // **Aggressive-Territorial**
    } else if (/tear|bruise|knock|beatdown|ugh | don't | break|stomp|wreck|regret|crush|burn|stain|smash|cut|death|bury|blood|fire|threat/.test(text) ||
               /tear you apart|mess you up|six feet under|fuck |  cunt|  bitch |  dyke |  faggot | pussy | break your jaw|send you to the afterlife|you’re dead meat|barking up the wrong tree/.test(text)) {
        audio = audios.aggressive;

    // **Defensive**
    } else if (/me|myself|why are you attacking me|stop| know| mean| ugly| go away| I’m not wrong|you don’t understand me|that’s not what I meant|I didn’t do anything wrong|stop blaming me|I’m doing my best/.test(text)) {
        audio = audios.defensive;

    // **Flirtatious**
    } else if (/eyes|smile|wink|connection|charm|ate pussy |  ate box| ate out | fingered her|  blow job | glory hole |  sixty nine|  69| love| lust| horny| erection|  hard on |  come |  coming|  cum |  ejaculation| blush|cute|talk|listen|type|vibe|party|dance|grind|hook up|sex|best friend|hang out|energy|fun|laugh/.test(text) ||
               /I can’t stop looking at you|you’re making it hard|see you| we’ve got a connection|you’re just my type|I love the way you laugh/.test(text)) {
        audio = audios.flirtatious;

    // **Potential Danger**
    } else if (/watch out|heads up|look out|careful|alert| R rated |  Trump |  President Trump | Donald Trump | they're coming now | im terrified | horror|  something is gonna happen |  gonna | premonition| ouija | crazy | danger|trap|run|stop|stay away|get out|back off|not safe|keep your distance/.test(text)) {
        audio = audios.danger;

    // **Terrified**
    } else if (/freaking|shaking|trembling|paralyzed|scared|ahhhhhh| ahh| no | freaky|  scary| piss myself | pissy| fucking| terrified|panic|nightmare|shock|control|heart racing|sick|breathe|fear/.test(text) ||
               /I’m freaking out|I’m losing it| losing | loser | paralyse| scare| I feel paralyzed|I’m scared to death|my heart is racing|I’m about to pass out/.test(text)) {
        audio = audios.terrified;

    // **Territorial-Soft**
    } else if (/mine|hands off|dibs|space|territory|spot|claim|turf| you're mine |  she's mine |  he's mine |  they're mine | babe | honey| pookie | protect|right|touch|staked|first|budging/.test(text) ||
               /that’s mine|I called it first|don’t touch what’s not yours|this is my territory|I’ve staked my claim/.test(text)) {
        audio = audios.territorial;
    }

    // Play the detected audio response
    if (audio) {
        playAudioForDuration(audio, duration);
    }
}

// Play audio for specified duration
function playAudioForDuration(audio, duration) {
    audio.currentTime = 0;
    audio.play();
    setTimeout(() => {
        audio.pause();
        restartRecognition();
    }, duration * 1000);
}

// Start listening when the page loads
window.onload = initSpeechRecognition;
