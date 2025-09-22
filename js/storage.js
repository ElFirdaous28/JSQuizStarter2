export function saveUser(username, userInfos) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    users[username] = userInfos;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", username);
}

export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}
