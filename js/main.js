import {
    getUsernameInput, showError, hideError, getStartQuizButtons, displayQuestion,
    showAnswerFeedback, updateTimerDisplay, displayResults, displayfeedbacks,
    renderAverageScoreChart, displayTopThree, renderPlayedGamesChart, renderTimeSpentChart
} from './ui.js';
import { saveUser, saveChoosedTheme, saveUserAnswer, saveScoreDate, saveTotalTime, getUserAnswers } from './storage.js';
import { fetchQuestions, validateAnswers } from './question.js';
import { exportPDF, exportJSON, exportCSV } from './export.js'


let currentUser = localStorage.getItem('currentUser');
let selectedTheme = localStorage.getItem('selectedTheme');
let themeQuestions = [];
let questionIndex = 0;
let score = 0;

let totalTime = 0; // total time in seconds
let timer;
let time;


// attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    switch (pageId) {
        case "index-page":
            initIndexPage();
            break;
        case "themes-page":
            initThemesPage();
            break;
        case "quiz-page":
            initQuizPage();
            break;
        case "results-page":
            initResultsPage();
            break;
        case "statistics-page":
            initStatisticsPage();
            break;
        default:
            console.warn("Unknown page:", pageId);
    }
});

function initIndexPage() {
    const form = document.getElementById("username-form");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const username = getUsernameInput();
        if (!username) {
            showError("Please enter a username");
            return;
        }
        hideError();
        saveUser(username);

        window.location.href = "pages/themes.html";
    });
}

function initThemesPage() {
    const startQuizButtons = getStartQuizButtons();
    startQuizButtons.forEach(button => {
        button.addEventListener("click", () => {
            saveChoosedTheme(button.getAttribute("data-theme"));
            window.location.href = "quiz.html";
        });
    });
}

async function initQuizPage() {
    const nextButton = document.getElementById("next-question");
    const seeResultsButton = document.getElementById("see-results");
    nextButton.addEventListener("click", goToNext);
    seeResultsButton.addEventListener("click", seeResults)

    themeQuestions = await fetchQuestions(selectedTheme);
    if (!themeQuestions.length) {
        console.error("No questions found for this theme.");
        return;
    }
    displayQuestion(questionIndex, themeQuestions[questionIndex]);
    startTimer();
}

async function initResultsPage() {
    const exportPdfButton = document.getElementById("export-pdf");
    const exportJsonButton = document.getElementById("export-json");
    const exportCSVButton = document.getElementById("export-csv");

    themeQuestions = await fetchQuestions(selectedTheme);
    displayResults(currentUser, selectedTheme, themeQuestions.length);
    displayfeedbacks(currentUser, selectedTheme, themeQuestions);
    exportPdfButton.addEventListener("click", () => {
        exportPDF("content-to-download", `JSQuizStarter_${currentUser}`);
    })
    exportJsonButton.addEventListener("click", () => {
        exportJSON(getUserAnswers(currentUser, selectedTheme), `JSQuizStarter_${currentUser}`);
    })
    exportCSVButton.addEventListener("click", () => {
        exportCSV(getUserAnswers(currentUser, selectedTheme), `JSQuizStarter_${currentUser}`);
    })
}
function initStatisticsPage() {
    renderAverageScoreChart();
    renderPlayedGamesChart();
    renderTimeSpentChart();
    displayTopThree();
}

function goToNext() {
    handleAnswer(false);
}

function seeResults() {
    handleAnswer(true);
}


function handleAnswer(isLastQuestion = false) {
    stopTimer();
    const checkedInputs = document.querySelectorAll('#options-container input[type="checkbox"]:checked');
    const selectedAnswers = Array.from(checkedInputs).map(input => input.value);

    const correct = validateAnswers(themeQuestions[questionIndex].answers, selectedAnswers);
    score += correct ? 1 : 0;

    showAnswerFeedback(themeQuestions[questionIndex].answers, checkedInputs, correct);
    saveUserAnswer(currentUser, selectedTheme, themeQuestions[questionIndex].id, selectedAnswers);

    if (isLastQuestion) {
        console.log('we can see results now!');
        saveScoreDate(currentUser, score, selectedTheme);
        saveTotalTime(currentUser, selectedTheme, totalTime);
        score = 0;
        setTimeout(() => window.location.href = 'results.html', 1000);
    } else {
        setTimeout(() => {
            questionIndex++;
            if (questionIndex < themeQuestions.length) {
                displayQuestion(questionIndex, themeQuestions[questionIndex], themeQuestions.length);
                startTimer();
            }
        }, 1000);
    }
}

// timer functions 
function startTimer() {
    time = 20;
    updateTimerDisplay(time);
    timer = setInterval(() => {
        time--;

        if (time < 0) {
            questionIndex < themeQuestions.length - 1 ? goToNext() : seeResults;
        } else {
            updateTimerDisplay(time);
        }
    }, 1000);
}

function stopTimer() {
    let spent = Math.max(0, 20 - time);
    totalTime += spent;

    clearInterval(timer);
}