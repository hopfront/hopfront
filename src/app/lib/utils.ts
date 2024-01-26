export function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export function generateRandomStringFromDateAndNumber(): string {
    return Math.random().toString(36).substring(2, 15);
}