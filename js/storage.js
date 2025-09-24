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

export function saveUserAnswer(currentUser, selectedTheme, questionId, userAnswers) {
    let users = getUsers();
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

export function saveScoreDate(currentUser, score, selectedTheme) {
    let users = getUsers();

    users[currentUser].themes[selectedTheme].score = score;
    users[currentUser].themes[selectedTheme].dateTime = new Date().toISOString();


    localStorage.setItem("users", JSON.stringify(users));

}