from flask import Blueprint, request, jsonify
import http.client
import json
import os

ai_routes = Blueprint("ai", __name__)

OPENAI_API_KEY = os.getenv("API_KEY")

# 预定义的问答对，可以根据需要添加更多
predefined_answers = {
    "what is your name?": "baloo"
    # 添加更多的问答对
}

@ai_routes.route("/", methods=["POST"])
def get_chatai():
    data = request.json
    user_query = data.get("query", "")

    # 检查用户的问题是否在预定义答案中
    if user_query in predefined_answers:
        answer = predefined_answers[user_query]
        return jsonify({"answer": answer}), 200

    conn = http.client.HTTPSConnection("api.openai.com")
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = json.dumps(
        {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": ("You are a pet care specialist"
                    ),
                },
                {"role": "user", "content": user_query},
            ],
            "temperature": 0.2,
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
