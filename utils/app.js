export function validateUsername(username) {
    try {
        let result = true;
        for (const word of username) {
            if (word !== word.toLowerCase() || word === ' ') {
                result = false;
            }
        }
        return result;
    } catch (error) {
        return null;
    }
}