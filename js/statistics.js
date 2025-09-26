import { getUsers } from './storage.js'

export function playedGamesPerTheme() {
    const users = Object.values(getUsers());

    const themePlayCounts = users.reduce((counts, user) => {
        Object.entries(user.themes).forEach(([theme, data]) => {
            if (data.status !== 'not-started') {
                counts[theme] = (counts[theme] || 0) + 1;
            } else {
                counts[theme] = counts[theme] || 0; // keep it 0
            }
        });
        return counts;
    }, {});

    return themePlayCounts;
}

export function averageScorePerTheme() {
    const users = Object.values(getUsers());

    // calculate sum of scores and played times
    const themeTotals = users.reduce((totals, user) => {
        Object.entries(user.themes).forEach(([theme, data]) => {
            if (data.score != null) {
                totals[theme] = totals[theme] || { sum: 0, count: 0 };
                totals[theme].sum += data.score; // ✅ use data.score
                totals[theme].count++;
            }
        });
        return totals;
    }, {});

    // calculate average for each theme
    const themeAverages = {};
    Object.entries(themeTotals).forEach(([theme, { sum, count }]) => {
        themeAverages[theme] = count > 0 ? sum / count : 0;
    });

    return themeAverages;
}

export function TopThree() {
    const users = Object.values(getUsers());

    // get usernames with total score
    const usersWithScores = Object.entries(getUsers()).map(([username, user]) => {
        const globalScore = Object.values(user.themes).reduce(
            (sum, data) => sum + (data.score || 0),
            0
        );
        return { username, globalScore };
    });
    // sort users by score
    usersWithScores.sort((a, b) => b.globalScore - a.globalScore);

    // return top 3

    return usersWithScores.slice(0, 3);
}
