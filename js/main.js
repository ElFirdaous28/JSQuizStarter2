import { getUsernameInput, showError, hideError, getStartQuizButtons } from './ui.js';
import { saveUser, saveChoosedTheme } from './storage.js';
import { fetchQuestions } from './question.js';

let chosenTheme = localStorage.getItem('selectedTheme');

function initializeUserInfos(event) {
    event.preventDefault();

    const username = getUsernameInput();

    if (!username) {
        showError("Please enter a username");
        return false;
    } else {
        hideError();
    }
    saveUser(username);

    window.location.href = "pages/thems.html";
    return true;
}

async function loadQuestions() {
    const questions = await fetchQuestions(chosenTheme);
    console.log(questions);
}

// attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    // index page
    if (pageId === 'index-page') {
        document.getElementById("username-form").addEventListener("submit", initializeUserInfos);
    }

    // themes page
    else if (pageId === 'themes-page') {
        const startQuizButtons = getStartQuizButtons();
        startQuizButtons.forEach(element => {
            element.addEventListener("click", () => {
                saveChoosedTheme(element.getAttribute('data-theme'));
                window.location.href = "quiz.html";
            })
        });
    }

    // quiz page
    else if (pageId === 'quiz-page') {
        loadQuestions()
    }
});