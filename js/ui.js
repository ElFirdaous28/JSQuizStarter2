import { getUsers, getUserAnswers } from './storage.js'
import { validateAnswers } from './question.js'
import { playedGamesPerTheme, averageScorePerTheme } from './statistics.js'

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

    questionsContainer.innerHTML = "";

    // append question Number
    const questionNumberDiv = document.createElement("div");
    questionNumberDiv.className = "question-number";
    questionNumberDiv.textContent = `Question ${questionIndex + 1}/10`;
    questionsContainer.appendChild(questionNumberDiv);

    // append question
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.textContent = question.question;
    questionsContainer.appendChild(questionDiv);

    // append questions
    const optionsContainer = document.createElement("div");
    optionsContainer.id = "options-container";

    question.options.forEach((option) => {
        const label = document.createElement("label");
        label.className = "option";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = questionIndex;
        checkbox.value.option;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));

        optionsContainer.appendChild(label);
    });
    questionsContainer.appendChild(optionsContainer);

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

        const questionBox = document.createElement("div");
        questionBox.className = "question-feedback-box";

        // append question number
        const questionNumberTitle = document.createElement("h2");
        questionNumberTitle.textContent = `Question ${index + 1}`;
        questionBox.appendChild(questionNumberTitle);

        // qppend question
        const questionText = document.createElement("p");
        questionText.textContent = question.question;
        questionBox.appendChild(questionText);

        // create options container
        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options-container";

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
                partiallyCorrect = userQuestionAnswers.userAnswers.some(ans =>
                    question.answers.includes(ans)
                );
            }

            const optionDiv = document.createElement("div");
            optionDiv.className = classes;
            optionDiv.textContent = option;
            optionsContainer.appendChild(optionDiv);
        });
        questionBox.appendChild(optionsContainer);

        // feedback note
        const feedbackNote = document.createElement("p");
        feedbackNote.classList.add("feedback-note");

        if (correct) {
            feedbackNote.classList.add("correct");
            feedbackNote.textContent = "Correct";
        } else if (partiallyCorrect) {
            feedbackNote.classList.add("partially");
            feedbackNote.textContent = "Partially correct";
        } else {
            feedbackNote.classList.add("incorrect");
            feedbackNote.textContent = "Incorrect";
        }

        questionBox.appendChild(feedbackNote);

        questionsContainer.appendChild(questionBox);
    });
}


export function displayPlayedGamesPerTheme() {
    const data = playedGamesPerTheme();
    const boxes = document.querySelectorAll(".nbr-plyed");

    boxes.forEach(box => {
        const theme = box.dataset.theme;
        if (data[theme] !== undefined) {
            box.textContent = data[theme];
        }
    });
}

export function displayAverageTheme() {
    const data = averageScorePerTheme();
    // console.log(data);

    const boxes = document.querySelectorAll(".average-score");

    boxes.forEach(box => {
        const theme = box.dataset.theme;
        if (data[theme] !== undefined) {
            box.textContent = data[theme];
        }
    });
}