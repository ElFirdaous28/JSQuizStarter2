export function getUsernameInput() {
    const input = document.getElementById("username-input");
    return input.value.trim();
}

export function showError(message) {
    const errorElement = document.getElementById("username-error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

export function hideError() {
    const errorElement = document.getElementById("username-error");
    errorElement.style.display = "none";
}

export function getStartQuizButtons() {
    return document.querySelectorAll(".start-quiz");
}

export function displayQuestion(questionIndex, question, length) {
    const nextButton = document.getElementById("next-question");

    let questionsContainer = document.getElementById('question-details');
    const seeResultsButton = document.getElementById('see-results');
    const quizContainer = document.querySelector('.quiz');
    let questionHtml;

    questionHtml = ` <div class="question-number">Question <span id="question-number">${questionIndex + 1}/10</span></div>
                                        <div class="question">${question.question}</div>
                                        <div id="options-container">`
    question.options.forEach((option) => {

        questionHtml += `<label class="option">
                        <input type="checkbox" name="${questionIndex}" value="${option}">
                        ${option}
                    </label>`;
    })

    questionHtml += `</div>
                     </div>`

    questionsContainer.innerHTML = questionHtml;

    if (questionIndex > 0) {
        quizContainer.style.border = '2px solid white';
        quizContainer.style.backgroundColor = 'white';
    }

    if ((questionIndex == length - 1)) {
        nextButton.style.display = 'none';
        seeResultsButton.style.display = 'block'
    }

    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", () => toggelNextButton(false));
    });
    toggelNextButton(true);
}

export function toggelNextButton(status) {
    const nextButton = document.getElementById("next-question");
    if (nextButton) {
        nextButton.disabled = status;
    }
}

export function showAnswerFeedback(correctAnswers, checkedInputs, correct) {
    const AllInputs = document.querySelectorAll('#options-container input[type="checkbox"]');
    const quizContainer = document.querySelector('.quiz');

    AllInputs.forEach(input => {
        if (correctAnswers.includes(input.value)) {
            input.parentElement.style.backgroundColor = '#28a745';
            input.parentElement.style.color = 'white';
            input.parentElement.style.borderColor = '#155724';
        }
    });

    if (correct) {
        quizContainer.style.border = '2px solid #28a745';
        quizContainer.style.backgroundColor = '#d4edda';
    }

    else {
        quizContainer.style.border = '2px solid #df3131ff';
        quizContainer.style.backgroundColor = '#f8d7da';
    }

    checkedInputs.forEach(checkedInput => {
        if (!correctAnswers.includes(checkedInput.value)) {
            checkedInput.parentElement.style.backgroundColor = '#df3131ff';
            checkedInput.parentElement.style.color = 'white';
            checkedInput.parentElement.style.borderColor = '#950606';
        }
    });
}