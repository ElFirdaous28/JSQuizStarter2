export function saveUser(username) {

    const userInfos = {
        themes: {
            "JavaScript Basics": { answers: [], score: 0, totalTime: 0, dateTime: '' },
            "DOM & Events": { answers: [], score: 0, totalTime: 0, dateTime: '' },
            "Objects & Arrays": { answers: [], score: 0, totalTime: 0, dateTime: '' }
        }
    };

    const users = JSON.parse(localStorage.getItem("users")) || {};
    users[username] = userInfos;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", username);
}

export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

export function saveChoosedTheme(choice) {
    localStorage.setItem("selectedTheme", choice);
}