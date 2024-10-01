from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Load quiz questions from JSON
with open('quiz_data.json', 'r') as f:
    quiz_data = json.load(f)

@app.route('/')
def quiz():
    return render_template('quiz.html', total_questions=len(quiz_data))

@app.route('/get_question/<int:question_id>')
def get_question(question_id):
    if 0 <= question_id < len(quiz_data):
        return jsonify(quiz_data[question_id])
    else:
        return jsonify({"error": "Invalid question ID"})

@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    question_id = data['question_id']
    selected_answer = data['selected_answer']

    correct_answer = quiz_data[question_id]['answer']  # Corrected from `questions` to `quiz_data`

    if selected_answer == correct_answer:
        return jsonify({'is_correct': True})
    else:
        return jsonify({'is_correct': False})
    
if __name__ == '__main__':
    app.run(debug=True)
