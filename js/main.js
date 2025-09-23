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
    else if (pageId === 'themes-page'){
        console.log('hi');
        
    }

});
