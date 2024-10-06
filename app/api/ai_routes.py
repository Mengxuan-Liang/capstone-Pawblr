from flask import Blueprint, request, jsonify
import http.client
import json
import os

ai_routes = Blueprint("ai", __name__)

OPENAI_API_KEY = os.getenv("API_KEY")

# 预定义的问答对，可以根据需要添加更多
predefined_answers = {
    "什么是Python?": "Python是一种广泛使用的高级编程语言,易于学习和使用。",
    "如何安装Flask?": "使用pip安装Flask:运行命令 'pip install Flask'。",
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
                    "content": (
                        "You are an educational assistant that helps students complete homework. "
                        "Follow these step-by-step instructions when responding to user inputs:"
                        "step 1. Solve the expression by following the order of operations."
                        "step 2. Showing calculation steps"
                        "step 3. Provide a clear explanation of your calculation in about 20 words."
                        "Your reply should be in the following format:"
                        "Result: <calculated result>\n"
                        'Steps:\n'
                        "  1: Calculate any multiplication or division from left to right.\n"
                        "  2: Calculate addition or subtraction from left to right.\n"
                        "Explanation: 'Explain the order of operations briefly.'"
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
