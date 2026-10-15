from flask import Flask, jsonify, request
from openai import OpenAI

app = Flask(__name__)

client = OpenAI()


@app.route("/")
def home():
    return jsonify({
        "message": "ICT620 AI backend is running"
    })


@app.route("/summarise", methods=["POST"])
def summarise():
    data = request.get_json()

    if not data or not data.get("text"):
        return jsonify({
            "error": "No text was provided."
        }), 400

    selected_text = data.get("text")
    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            instructions=(
                "You are an AI learning assistant supporting "
                "neurodivergent university students. "
                "Summarise the provided learning content in clear, "
                "simple language. Use short sentences and bullet points. "
                "Highlight key concepts and preserve important facts. "
                "Do not invent information. "
                "Use plain text only. Do not use Markdown symbols such as "
                "#, **, or backticks. Use clear headings and short bullet points."
            ),
            input=selected_text
        )

        return jsonify({
            "summary": response.output_text
        })

    except Exception as error:
        print("OpenAI error response:", getattr(
            error, "body", None), flush=True)

        return jsonify({
            "error": "AI summarisation failed. Check the backend logs."
        }), 500


@app.route("/breakdown", methods=["POST"])
def breakdown():
    data = request.get_json(silent=True)

    if not data or not data.get("text"):
        return jsonify({
            "error": "No task was provided."
        }), 400

    selected_text = data.get("text")

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            instructions=(
                "You are an AI learning assistant supporting "
                "neurodivergent university students. "
                "Break the provided task into clear, manageable steps. "
                "Use simple language and numbered instructions. "
                "Make each step specific to the actual task. "
                "Avoid overwhelming the student with unnecessary details. "
                "Do not invent assignment requirements. "
                "Use plain text only. Do not use Markdown symbols such as "
                "#, **, or backticks. "
                "Present the task as a clear numbered list. "
                "Keep each step short, specific, and easy to follow."
            ),
            input=selected_text
        )

        return jsonify({
            "breakdown": response.output_text
        })

    except Exception as error:
        print("Task breakdown failed:", type(error).__name__)

        return jsonify({
            "error": "AI task breakdown failed."
        }), 500


@app.route("/guided-notes", methods=["POST"])
def guided_notes():
    data = request.get_json(silent=True)

    if not data or not data.get("text"):
        return jsonify({
            "error": "No learning content was provided."
        }), 400

    selected_text = data.get("text")

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            instructions=(
                "You are an AI learning assistant designed to support "
                "neurodivergent university students. "
                "Generate structured guided notes from the provided "
                "educational content. "
                "Use clear, simple language and short sentences. "
                "Organise the notes using these sections:\n"
                "1. Topic Overview\n"
                "2. Key Concepts\n"
                "3. Important Details\n"
                "4. Guiding Questions\n"
                "5. Quick Review\n"
                "Include questions that help students actively engage "
                "with the material and check their understanding. "
                "Keep the notes concise and easy to scan. "
                "Do not invent facts that are not supported by the text. "
                "Use plain text only. Do not use Markdown symbols such as "
                "#, **, or backticks. Use clear headings, numbered lists, "
                "and short bullet points."
            ),
            input=selected_text
        )

        return jsonify({
            "notes": response.output_text
        })

    except Exception as error:
        print("Guided notes failed:", type(error).__name__)

        return jsonify({
            "error": "AI guided notes generation failed."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
