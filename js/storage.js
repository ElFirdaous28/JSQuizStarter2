export function saveUser(username) {

    const userInfos = {
        themes: {
            "javascript-basics": { answers: [], score: 0, totalTime: 0, dateTime: '', status: 'not-started' },
            "dom-events": { answers: [], score: 0, totalTime: 0, dateTime: '', status: 'not-started' },
            "objects-arrays": { answers: [], score: 0, totalTime: 0, dateTime: '', status: 'not-started' }
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
    users[currentUser].themes[selectedTheme].status = 'completed';
    users[currentUser].themes[selectedTheme].dateTime = new Date().toISOString();


    localStorage.setItem("users", JSON.stringify(users));

}
export function saveTotalTime(currentUser, selectedTheme, totalTime) {
    let users = getUsers();

    users[currentUser].themes[selectedTheme].totalTime = totalTime;
    localStorage.setItem("users", JSON.stringify(users));
}

export function getUserAnswers(currentUser, selectedTheme) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[currentUser] || !users[currentUser].themes[selectedTheme]) {
        return [];
    }
    return users[currentUser].themes[selectedTheme].answers;
}