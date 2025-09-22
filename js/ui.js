export function getUsernameInput() {
    const input = document.getElementById("username-input");
    return input.value.trim();
}

export function showError(message) {
    const errorElement = document.getElementById("username-error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

export function hideError() {
    const errorElement = document.getElementById("username-error");
    errorElement.style.display = "none";
}