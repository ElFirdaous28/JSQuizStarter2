import { getUsers, getUserAnswers } from './storage.js'
import { validateAnswers } from './question.js'
import { playedGamesPerTheme, averageScorePerTheme, TopThree, averageTimePerTheme } from './statistics.js'

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
        checkbox.value = option;

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

export function displayTopThree() {
    const data = TopThree();
    const container = document.getElementById("top-three");
    container.innerHTML = "";

    data.forEach(user => {
        const div = document.createElement("div");
        div.classList.add("top-three-box");

        // first letter
        const firstLetter = document.createElement("div");
        firstLetter.classList.add("username-first-letter");
        firstLetter.textContent = user.username.charAt(0).toUpperCase();

        // username
        const username = document.createElement("div");
        username.classList.add("username");
        username.textContent = user.username.toUpperCase();

        // global score
        const score = document.createElement("div");
        score.classList.add("global-score");
        score.textContent = `${user.globalScore} Points`;

        div.append(firstLetter, username, score);
        container.appendChild(div);
    });
}


// ================================================


export function renderPlayedGamesChart() {
    const dataObj = playedGamesPerTheme();
    const labels = Object.keys(dataObj);
    const data = Object.values(dataObj);

    const ctx = document.getElementById('played-games-chart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut', // or 'doughnut'
        data: {
            labels: labels,
            datasets: [{
                label: 'Played Games per Theme',
                data: data,
                backgroundColor: [
                    '#f0b84e',
                    '#16325B',
                    '#2d342c'
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const data = context.dataset.data;
                            const total = data.reduce((sum, val) => sum + val, 0);
                            const value = context.parsed;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${percentage}%`;
                        }
                    }
                }
            }
        }
    });
}


export function renderAverageScoreChart() {
    const ctx = document.getElementById('average-score-chart').getContext('2d');

    const averages = averageScorePerTheme();
    const labels = Object.keys(averages);
    const data = Object.values(averages);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Score',
                data: data,
                backgroundColor: ['#f0b84e', '#16325B', '#2d342c'],
                borderColor: ['#d1a843', '#121f48', '#1f261f'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (tooltipItem) => `${tooltipItem.raw} Points`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10 //max score
                }
            }
        }
    });
}


export function renderTimeSpentChart() {
    const data = averageTimePerTheme();
    const ctx = document.getElementById('average-time-chart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Average Time (seconds)',
                data: Object.values(data),
                backgroundColor: ['#f0b84e', '#16325B', '#2d342c'],
                borderColor: ['#d1a843', '#121f48', '#1f261f'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Time (s)'
                    }
                }
            }
        }
    });
}

