import { getUsernameInput, showError, hideError, getStartQuizButtons } from './ui.js';
import { saveUser, saveChoosedTheme } from './storage.js';

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

// attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    if (pageId === 'index-page') {
        document.getElementById("username-form").addEventListener("submit", initializeUserInfos);
    }
    else if (pageId === 'themes-page') {
        const startQuizButtons = getStartQuizButtons();
        startQuizButtons.forEach(element => {

            element.addEventListener("click", () => saveChoosedTheme(element.getAttribute('data-theme')));
        });
    }
});
