import openai
from playsound import playsound

# Set your OpenAI API key here
openai.api_key = 'your_openai_api_key'

# Define the paths to your audio files
audio_files = {
    "greeting": "coo-greeting.mp3",
    "aggressive": "aggressive-territorial.mp3",
    "defensive": "defensive.mp3",
    "flirtatious": "flirtatious.mp3",
    "motherly": "motherly-nuturing.mp3",
    "danger": "potential-danger.mp3",
    "terrified": "terrified-petrified-grunts.mp3",
    "territorial_soft": "territorial-soft.mp3"
}

# Function to play the corresponding audio file
def play_audio(file_key):
    try:
        playsound(audio_files[file_key])
    except Exception as e:
        print(f"Error playing audio: {e}")

# Function to categorize user input and play corresponding audio
def categorize_and_play(user_input):
    # Lowercase the input for easier matching
    text = user_input.lower()
    
    # Determine which category the input falls into
    if any(greet in text for greet in ["hi", "hello", "hey", "greetings"]):
        play_audio("greeting")
    elif "angry" in text or "furious" in text or "rage" in text:
        play_audio("aggressive")
    elif "defensive" in text or "insecure" in text or "small" in text:
        play_audio("defensive")
    elif "flirt" in text or "sexy" in text or "beautiful" in text:
        play_audio("flirtatious")
    elif "care" in text or "nurture" in text or "mother" in text:
        play_audio("motherly")
    elif "danger" in text or "protest" in text or "threat" in text:
        play_audio("danger")
    elif "scared" in text or "terrified" in text or "petrified" in text:
        play_audio("terrified")
    elif "territory" in text or "mine" in text or "protect" in text:
        play_audio("territorial_soft")
    else:
        print("No matching audio file for this input.")

# Function to interact with the OpenAI chatbot
def get_chat_response(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['choices'][0]['message']['content']

# Main chatbot loop
def chat():
    print("Chatbot is running. Type something to interact.")
    while True:
        user_input = input("You: ")
        
        # Play the corresponding audio based on user input
        categorize_and_play(user_input)
        
        # Get a chatbot response (optional)
        response = get_chat_response(user_input)
        print(f"Chatbot: {response}")

if __name__ == "__main__":
    chat()
