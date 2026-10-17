// Tiny, safe wrappers around localStorage (private mode / quota / bad JSON never crash the app).

export const loadJSON = (key, fallback) => {
    try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const saveJSON = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* storage full or unavailable – ignore */
    }
};