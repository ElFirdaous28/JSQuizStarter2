export async function loadQuestions(theme) {
    try {
        const response = await fetch(`../themes/${theme}.json`);
        const data = await response.json();

        console.log("Questions loaded:", data);

    } catch (error) {
        console.error('Error loading questions JSON:', error);
    }
}