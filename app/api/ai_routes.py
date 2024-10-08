from flask import Blueprint, request, jsonify
import http.client
import json
import os

ai_routes = Blueprint("ai", __name__)

API_KEY = os.environ.get("API_KEY")

@ai_routes.route("/", methods=["POST"])
def get_chatai():
    data = request.json
    user_query = data.get("query", "")
    temperature = data.get("temperature", 0.7)
    # print('!!!!!!temp!!',temperature)

    conn = http.client.HTTPSConnection("api.openai.com")
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    payload = json.dumps(
        {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": (
                    " You are a friendly and knowledgeable assistant for Pawblr, a dog-themed social media platform."
                    " Your goal is to engage users by providing fun, informative, and community-driven content related to dogs."
                    " Always respond in a warm, friendly tone, and encourage users to share their own experiences."
                    ),
                },
                {"role": "user", "content": user_query},
            ],
            "temperature": temperature,
            "top_p": 0.9,
            "max_tokens": 150, 
            "presence_penalty": 0.5,
            "frequency_penalty": 0.5,
        }
    )

    try:
        conn.request("POST", "/v1/chat/completions", payload, headers)
        response = conn.getresponse()
        data = response.read()
        response_json = json.loads(data.decode("utf-8"))
        return jsonify(response_json), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
