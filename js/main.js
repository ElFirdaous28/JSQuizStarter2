import { getUsernameInput, showError, hideError, getStartQuizButtons, displayQuestion, showAnswerFeedback } from './ui.js';
import { saveUser, saveChoosedTheme, saveUserAnswer, saveScoreDate } from './storage.js';
import { fetchQuestions, validateAnswers } from './question.js';

let currentUser = localStorage.getItem('currentUser');
let selectedTheme = localStorage.getItem('selectedTheme');
let themeQuestions = [];
let questionIndex = 0;
let score = 0;

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
}

function goToNext() {
    handleAnswer(false);
}

function seeResults() {
    handleAnswer(true);
}

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
            // initFeedbackPage();
            break;
        default:
            console.warn("Unknown page:", pageId);
    }
});

function handleAnswer(isLastQuestion = false) {
    const checkedInputs = document.querySelectorAll('#options-container input[type="checkbox"]:checked');
    const selectedAnswers = Array.from(checkedInputs).map(input => input.value);

    const correct = validateAnswers(themeQuestions[questionIndex].answers, selectedAnswers);
    score += correct ? 1 : 0;

    showAnswerFeedback(themeQuestions[questionIndex].answers, checkedInputs, correct);
    saveUserAnswer(currentUser, selectedTheme, themeQuestions[questionIndex].id, selectedAnswers);

    if (isLastQuestion) {
        saveScoreDate(currentUser, score, selectedTheme);
        score = 0;
        setTimeout(() => window.location.href = 'results.html', 1000);
    } else {
        setTimeout(() => {
            questionIndex++;
            if (questionIndex < themeQuestions.length) {
                displayQuestion(questionIndex, themeQuestions[questionIndex], themeQuestions.length);
            }
        }, 1000);
    }
}