let questions = {};

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();

        data.themes.forEach(theme => {
            questions[theme.theme] = theme.questions;
        });

        // console.log("Questions loaded:", questions);

    } catch (error) {
        console.error('Error loading questions JSON:', error);
    }
}

let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser');
let selectedTheme = localStorage.getItem('selectedTheme');

let questionIndex = 0;
let themeQuestions;
const nextButton = document.getElementById('next-question');
const seeResultsButton = document.getElementById('see-results');
const quizContainer = document.querySelector('.quiz');

let score = 0;
let timerElement = document.getElementById('timer');
let totalTime = 0; // total time in seconds
let timer;
let time;

// Save theme choice
function saveChoosedTheme(choice) {
    localStorage.setItem("selectedTheme", choice);
}

// initialize user infos
function initializeUserInfos(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username-input");
    const errorElement = document.getElementById("username-error");
    const username = usernameInput.value.trim();

    if (!username) {
        errorElement.textContent = "Please enter a username";
        errorElement.style.display = "block";
        return false;
    } else {
        errorElement.style.display = "none";
    }

    const userInfos = {
        themes: {
            "JavaScript Basics": {
                answers: [],
                score: 0,
                totalTime: 0,
                dateTime: ''
            },
            "DOM & Events": {
                answers: [],
                score: 0,
                totalTime: 0,
                dateTime: ''
            },
            "Objects & Arrays": {
                answers: [],
                score: 0,
                totalTime: 0,
                dateTime: ''
            }
        }
    };
    const users = JSON.parse(localStorage.getItem("users")) || {};

    users[username] = userInfos;

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", username);

    window.location.href = "thems.html";
    return true;
}
// ================================= quiz logique =================================
// timer
function startTimer() {
    time = 20;
    timerElement.textContent = `00:${String(time).padStart(2, '0')}`;
    timer = setInterval(() => {
        time--;

        if (time < 0) {
            questionIndex < themeQuestions.length - 1 ? goToNext() : seeResults;
        } else {
            timerElement.textContent = `00:${String(time).padStart(2, '0')}`;
        }
    }, 1000);
}

function stopTimer() {
    let spent = Math.max(0, 20 - time);
    totalTime += spent;

    users[currentUser].themes[selectedTheme].totalTime = totalTime;
    localStorage.setItem("users", JSON.stringify(users));
    clearInterval(timer);
}

// initialize the quiz
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();

    // start the quiz
    themeQuestions = questions[selectedTheme];
    if (window.location.href.includes("quiz")) {
        setHtmlQuestion(questionIndex);
        startTimer();
    }

    if (window.location.href.includes("results")) {
        displayResults();
        displayCorrect();
    }

});

// add the question as html
function setHtmlQuestion(questionIndex) {
    let questionsContainer = document.getElementById('question-details');
    let questionHtml;

    questionHtml = ` <div class="question-number">Question <span id="question-number">${questionIndex + 1}/10</span></div>
                                        <div class="question">${themeQuestions[questionIndex].question}</div>
                                        <div id="options-container">`
    themeQuestions[questionIndex].options.forEach((option) => {
        const isCorrect = themeQuestions[questionIndex].answers.includes(option) ? 'correct' : '';

        questionHtml += `<label class="option ${isCorrect}" onclick="enableNextButton()">
                        <input type="checkbox" value="${option}">
                        ${option}
                    </label>`;
    })

    questionHtml += `</div>
                     </div>`

    questionsContainer.innerHTML = questionHtml;
}

// listen to Next Button click
function goToNext() {
    stopTimer();
    const checkedInputs = document.querySelectorAll('#options-container input[type="checkbox"]:checked');
    const selectedAnswers = Array.from(checkedInputs).map(input => input.value);

    let correct = checkAnswers(themeQuestions[questionIndex].answers, selectedAnswers);
    score += correct ? 1 : 0
    showAnswerFeedback(themeQuestions[questionIndex].answers, checkedInputs, correct)
    nextButton.disabled = true;
    saveUserAnswer(themeQuestions[questionIndex].id, selectedAnswers)

    setTimeout(() => {
        questionIndex++

        if (questionIndex < themeQuestions.length) {
            setHtmlQuestion(questionIndex)
            startTimer();
        }
        if ((questionIndex == themeQuestions.length - 1)) {
            nextButton.style.display = 'none';
            seeResultsButton.style.display = 'block'
        }
        quizContainer.style.border = '2px solid white';
        quizContainer.style.backgroundColor = 'white';
    }, 1000)
}


// listen to see Results Button
function seeResults() {

    stopTimer();
    const checkedInputs = document.querySelectorAll('#options-container input[type="checkbox"]:checked');
    const selectedAnswers = Array.from(checkedInputs).map(input => input.value);
    let correct = checkAnswers(themeQuestions[questionIndex].answers, selectedAnswers);
    score += correct ? 1 : 0
    showAnswerFeedback(themeQuestions[questionIndex].answers, checkedInputs, correct)

    saveUserAnswer(themeQuestions[questionIndex].id, selectedAnswers)


    users[currentUser].themes[selectedTheme].score = score;
    users[currentUser].themes[selectedTheme].dateTime = new Date().toISOString();


    localStorage.setItem("users", JSON.stringify(users));

    score = 0;
    setTimeout(() => {
        window.location.href = 'results.html'
    }, 1000)
}

// enable next button
function enableNextButton() {
    nextButton.disabled = false
}

function checkAnswers(correctAnswers, userAnswers) {
    const sortedCorrect = [...correctAnswers].sort();
    const sortedUser = [...userAnswers].sort();
    return sortedCorrect.length === sortedUser.length &&
        sortedCorrect.every((val, i) => val === sortedUser[i]);
}

function saveUserAnswer(questionId, userAnswers) {
    if (!users[currentUser]) return;

    if (!users[currentUser].themes[selectedTheme]) {
        users[currentUser].themes[selectedTheme] = { answers: [], score: 0, totalTime: 0 };
    }

    let answers = users[currentUser].themes[selectedTheme].answers;

    let existing = answers.find(answer => answer.questionId === questionId);

    if (existing) {
        existing.userAnswers = userAnswers;
    } else {
        answers.push({ questionId, userAnswers });
    }

    localStorage.setItem("users", JSON.stringify(users));
}

function showAnswerFeedback(correctAnswers, checkedInputs, correct) {
    const AllInputs = document.querySelectorAll('#options-container input[type="checkbox"]');

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

// ================================= score logique =================================
function displayResults() {
    document.getElementById('nbr-correct').textContent = users[currentUser].themes[selectedTheme].score;
    document.getElementById('nbr_incorrect').textContent = themeQuestions.length - users[currentUser].themes[selectedTheme].score;
    document.getElementById('resolution-time').textContent = `${users[currentUser].themes[selectedTheme].totalTime} `;
}

function displayCorrect() {
    let questionsContainer = document.getElementById('questions-container');
    let userAnswers = users[currentUser].themes[selectedTheme].answers;

    themeQuestions.forEach((question, index) => {
        let userQuestionAnswers = userAnswers.find(ans => ans.questionId === question.id);

        let correct = false;
        let partiallyCorrect = false;

        if (userQuestionAnswers) {
            correct = checkAnswers(question.answers, userQuestionAnswers.userAnswers);
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

// download result as pdf
document.getElementById("download-button").addEventListener("click", function () {
    html2canvas(document.getElementById("content-to-download"), {
        scale: 2 // better quality
    }).then(function (canvas) {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 190; // width in A4 (210 - margins)
        const pageHeight = pdf.internal.pageSize.height; // 297mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        // First page
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add extra pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`JSQuizStarter_${currentUser}`);
    });
});