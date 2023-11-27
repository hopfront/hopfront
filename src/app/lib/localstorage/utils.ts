export function trySetToLocalStorage(key: string, value: string) {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(key, value);
}

export function tryGetFromLocalStorage<T>(key: string): T | undefined {
    if (typeof window === 'undefined') {
        return;
    }

    const value = localStorage.getItem(key);
    if (value) {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            return;
        }
    }

    return;
}