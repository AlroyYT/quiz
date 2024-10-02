let currentQuestion = 0;
let totalQuestions = parseInt(document.getElementById('progress-text').textContent.split(' ')[3]);
let score = 0;
let selectedAnswers = [];

document.addEventListener("DOMContentLoaded", function() {
    loadQuestion(currentQuestion);
    document.getElementById("prev-button").disabled = true;
});

function loadQuestion(questionId) {
    fetch(`/get_question/${questionId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                document.getElementById("question-title").textContent = `Question ${questionId + 1}`;
                document.getElementById("question-text").textContent = data.question;
                let options = data.options.map((option, index) => `
                    <div class="form-check option">
                        <input class="form-check-input" type="radio" name="option" id="option${index}" value="${option}" 
                        ${selectedAnswers[questionId] === option ? 'checked' : ''}>
                        <label class="form-check-label" for="option${index}">
                            ${option}
                        </label>
                    </div>
                `).join("");
                document.getElementById("options-container").innerHTML = options;
                document.getElementById('answer-display').textContent = '';
                updateButtonsState();
            }
        });
    document.getElementById('next-button').disabled = true;
    enableOptions();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
        loadQuestion(currentQuestion);
    } else {
        showScore();
    }
    updateProgressBar();
}

function checkAnswer() {
    let selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        let selectedAnswer = selectedOption.value;
        fetch('/check_answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_id: currentQuestion, selected_answer: selectedAnswer })
        })
        .then(response => response.json())
        .then(data => {
            if (data.is_correct) {
                score++;
                document.getElementById('answer-display').innerHTML = `<span class="correct">Correct! Well done!</span>`;
            } else {
                fetch(`/get_question/${currentQuestion}`)
                    .then(response => response.json())
                    .then(questionData => {
                        document.getElementById('answer-display').innerHTML = `<span class="incorrect">Incorrect! The correct answer is: <strong>${questionData.answer}</strong></span>`;
                    });
            }
            document.getElementById('next-button').disabled = false;
            disableOptions();
        });
    } else {
        alert("Please select an option.");
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
        updateProgressBar();
    }
}

function updateProgressBar() {
    let progress = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `Question ${currentQuestion + 1} of ${totalQuestions}`;
}

function updateButtonsState() {
    document.getElementById("prev-button").disabled = currentQuestion === 0;
    document.getElementById("check-answer-button").disabled = false;
}

function showScore() {
    document.querySelector('.question-container').innerHTML = `
        <h2>Your Score: ${score} / ${totalQuestions}</h2>
    `;
}

function disableOptions() {
    let options = document.querySelectorAll('input[name="option"]');
    options.forEach(option => {
        option.disabled = true;
    });
}

function enableOptions() {
    let options = document.querySelectorAll('input[name="option"]');
    options.forEach(option => {
        option.disabled = false;
    });
}
