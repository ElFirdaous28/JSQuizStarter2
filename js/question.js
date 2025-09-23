export async function fetchQuestions(theme) {
    try {
        const response = await fetch(`../themes/${theme}.json`);
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();

        // check if having questions and it is an array
        if (!data.questions || !Array.isArray(data.questions)) {
            throw new Error("Invalid JSON format: 'questions' array missing");
        }

        // Validate each question object
        data.questions.forEach((q, index) => {
            if (
                typeof q.id !== "number" ||
                typeof q.question !== "string" ||
                !Array.isArray(q.options) ||
                !Array.isArray(q.answers)
            ) {
                throw new Error(`Invalid question format at index ${index}`);
            }
            if (q.options.length === 0) {
                throw new Error(`Options cannot be empty at index ${index}`);
            }
            if (q.answers.length === 0) {
                throw new Error(`Answers cannot be empty at index ${index}`);
            }
        });

        return data.questions;

    } catch (error) {
        console.error("Error loading or validating questions JSON:", error);
        return [];
    }
}
