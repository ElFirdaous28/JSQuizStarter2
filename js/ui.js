import { getUsers, getUserAnswers } from './storage.js'
import { validateAnswers } from './question.js'

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
        seeResultsButton.style.display = 'block';
        seeResultsButton.disabled = false;
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

export function updateTimerDisplay(seconds) {
    const timerElement = document.getElementById("timer");
    if (!timerElement) return;
    timerElement.textContent = `00:${String(seconds).padStart(2, '0')}`;
}

export function displayResults(currentUser, selectedTheme, themeQuestionsLength) {
    let users = getUsers();

    document.getElementById('nbr-correct').textContent = users[currentUser].themes[selectedTheme].score;
    document.getElementById('nbr_incorrect').textContent = themeQuestionsLength - users[currentUser].themes[selectedTheme].score;
    document.getElementById('resolution-time').textContent = `${users[currentUser].themes[selectedTheme].totalTime} `;
}

export function displayfeedbacks(currentUser, selectedTheme, themeQuestions) {
    let questionsContainer = document.getElementById('questions-container');
    let userAnswers = getUserAnswers(currentUser, selectedTheme);

    themeQuestions.forEach((question, index) => {
        let userQuestionAnswers = userAnswers.find(ans => ans.questionId === question.id);

        let correct = false;
        let partiallyCorrect = false;

        if (userQuestionAnswers) {
            correct = validateAnswers(question.answers, userQuestionAnswers.userAnswers);
        }

        let questionDiv = `
            <div class="question-feedback-box">
                <h2>Question ${index + 1}</h2>
                <p>${question.question}</p>
                <div class="options-container">`;

        // loop options
        question.options.forEach(option => {
            let classes = "feedback-option";

            if (question.answers.includes(option)) {
                classes += " correct";
            } else if (
                userQuestionAnswers &&
                userQuestionAnswers.userAnswers.includes(option)
            ) {
                classes += " incorrect";
            }
            if (!correct && userQuestionAnswers) {
                partiallyCorrect = userQuestionAnswers.userAnswers.some(ans => question.answers.includes(ans));
            }
            questionDiv += `<div class="${classes}">${option}</div>`;
        });

        if (correct) {
            questionDiv += `<p class="feedback-note correct" style="color: #28a745;">Correct</p>`; // green
        } else if (partiallyCorrect) {
            questionDiv += `<p class="feedback-note partially" style="color: #f0b84e;">Partially correct</p>`; // yellow/orange
        } else {
            questionDiv += `<p class="feedback-note incorrect" style="color: #df3131;">Incorrect</p>`; // red
        }


        questionDiv += `
                </div>
            </div>
        `;

        questionsContainer.innerHTML += questionDiv;
    });
}
