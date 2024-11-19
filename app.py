from flask import Flask, request, jsonify
from speechbrain.pretrained import SpeakerRecognition

app = Flask(__name__)

# Load the pre-trained SpeechBrain emotion model
emotion_model = SpeakerRecognition.from_hparams(source="speechbrain/emotion-recognition", savedir="tmpdir")

@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    # Expect audio file from frontend
    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400
    
    # Save the audio file temporarily
    audio_path = "temp_audio.wav"
    audio_file.save(audio_path)

    # Use SpeechBrain to classify emotion
    try:
        emotion = emotion_model.classify_file(audio_path)
        return jsonify({"emotion": emotion})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
