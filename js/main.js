import { getUsernameInput, showError, hideError } from './ui.js';
import { saveUser } from './storage.js';

function initializeUserInfos(event) {
    event.preventDefault();

    const username = getUsernameInput();

    if (!username) {
        showError("Please enter a username");
        return false;
    } else {
        hideError();
    }

    const userInfos = {
        themes: {
            "JavaScript Basics": { answers: [], score: 0, totalTime: 0, dateTime: '' },
            "DOM & Events": { answers: [], score: 0, totalTime: 0, dateTime: '' },
            "Objects & Arrays": { answers: [], score: 0, totalTime: 0, dateTime: '' }
        }
    };

    saveUser(username, userInfos);

    window.location.href = "pages/thems.html";
    return true;
}

// attach event listener
document.getElementById("username-form").addEventListener("submit", initializeUserInfos);
