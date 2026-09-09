const SESSION_HINT_STORAGE_KEY = "sessionHint";

export const sessionHintStore = {
    exists: () => {
        return Boolean(localStorage.getItem(SESSION_HINT_STORAGE_KEY));
    },
    set: () => {
        localStorage.setItem(SESSION_HINT_STORAGE_KEY, "true");
    },
    clear: () => {
        localStorage.removeItem(SESSION_HINT_STORAGE_KEY);
    },
}

export default sessionHintStore;