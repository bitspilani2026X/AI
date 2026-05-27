from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

RASA_URL = "https://your-rasa-service.onrender.com/webhooks/rest/webhook"

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    print("User:", user_message)

    rasa_response = requests.post(
        RASA_URL,
        json={"message": user_message}
    )

    print("Rasa:", rasa_response.json())

    return jsonify(rasa_response.json())

if __name__ == "__main__":
   app.run(host="0.0.0.0", port=5000)
