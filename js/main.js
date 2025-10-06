import {
    getUsernameInput, showError, hideError, displayQuestion,
    showAnswerFeedback, updateTimerDisplay, displayResults, displayfeedbacks,
    renderAverageScoreChart, displayTopThree, renderPlayedGamesChart, renderTimeSpentChart,
    manageButtonsState,
    displaThemeMode
} from './ui.js';
import { saveUser, saveChoosedTheme, saveUserAnswer, saveScoreDate, saveTotalTime, getUserAnswers, saveStatus, saveProgressIndex, getProgressIndex, getTotalTime } from './storage.js';
import { fetchQuestions, validateAnswers } from './question.js';
import { exportPDF, exportJSON, exportCSV } from './export.js'


let currentUser = localStorage.getItem('currentUser');
let selectedTheme = localStorage.getItem('selectedTheme');
let mode = localStorage.getItem("mode") || "quiz";

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
    localStorage.setItem("mode", "quiz");

    const startQuizButtons = document.querySelectorAll(".start-quiz");
    const seeResultsButtons = document.querySelectorAll(".theme-result");
    const ResumeQuizButtons = document.querySelectorAll(".theme-resume");

    startQuizButtons.forEach(button => {
        button.addEventListener("click", () => {
            saveChoosedTheme(button.getAttribute("data-theme"));
            window.location.href = "quiz.html";
        });
    });

    seeResultsButtons.forEach(button => {
        button.addEventListener("click", () => {
            saveChoosedTheme(button.getAttribute("data-theme"));
            window.location.href = "results.html";
        });
    });
    ResumeQuizButtons.forEach(button => {
        button.addEventListener("click", () => {
            saveChoosedTheme(button.getAttribute("data-theme"));
            localStorage.setItem("mode", "resume");
            window.location.href = "quiz.html";
        });
    });
    manageButtonsState(currentUser);
}

async function initQuizPage() {
    const nextButton = document.getElementById("next-question");
    const seeResultsButton = document.getElementById("see-results");
    const stopButton = document.getElementById("stop-quiz");
    nextButton.addEventListener("click", goToNext);
    seeResultsButton.addEventListener("click", seeResults);
    stopButton.addEventListener("click", stopQuiz);

    displaThemeMode(selectedTheme, mode)

    themeQuestions = await fetchQuestions(selectedTheme);
    questionIndex = 0;

    if (mode === "review") {
        const userAnswers = getUserAnswers(currentUser, selectedTheme);

        themeQuestions = themeQuestions.filter(q => {
            const userAnswer = userAnswers.find(ans => ans.questionId === q.id);
            const isCorrect = validateAnswers(q.answers, userAnswer.userAnswers);
            return !isCorrect;
        });
    }
    else if (mode === "resume") {
        totalTime = getTotalTime(currentUser, selectedTheme)
        questionIndex = getProgressIndex(currentUser, selectedTheme);
    }

    displayQuestion(questionIndex, themeQuestions[questionIndex], themeQuestions.length);
    if (mode !== "review") startTimer();
}

async function initResultsPage() {
    const exportPdfButton = document.getElementById("export-pdf");
    const exportJsonButton = document.getElementById("export-json");
    const exportCSVButton = document.getElementById("export-csv");
    const reviewButton = document.getElementById("review-quiz");

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

    reviewButton.addEventListener("click", () => {
        localStorage.setItem("mode", "review");
        window.location.href = "quiz.html";
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

    if (mode !== "review") {
        saveUserAnswer(currentUser, selectedTheme, themeQuestions[questionIndex].id, selectedAnswers);
    }

    if (isLastQuestion) {
        if (mode !== "review") {
            saveScoreDate(currentUser, score, selectedTheme);
            saveTotalTime(currentUser, selectedTheme, totalTime);
            saveStatus(currentUser, selectedTheme, 'completed')
        }
        score = 0;
        setTimeout(() => {
            if (mode === "review") {
                localStorage.setItem("mode", "quiz")
            }
            window.location.href = 'results.html';
        }, 1000);
    } else {
        setTimeout(() => {
            questionIndex++;
            if (questionIndex < themeQuestions.length) {
                displayQuestion(questionIndex, themeQuestions[questionIndex], themeQuestions.length);
                if (mode !== "review") startTimer();
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
            questionIndex < themeQuestions.length - 1 ? goToNext() : seeResults();
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

function stopQuiz() {
    saveScoreDate(currentUser, score, selectedTheme);
    saveTotalTime(currentUser, selectedTheme, totalTime);
    saveStatus(currentUser, selectedTheme, 'paused');
    saveProgressIndex(currentUser, selectedTheme, questionIndex);
    localStorage.setItem("mode", "quiz");
    window.location.href = "../index.html"
}