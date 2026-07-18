// Calendar-date helpers that respect an IANA timezone (e.g. "America/New_York")
// instead of the server's own clock, so "today" matches the user's actual day.

export function getLocalDateString(date: Date, timeZone: string): string {
    try {
        // en-CA formats as YYYY-MM-DD, which matches how dates are stored.
        return new Intl.DateTimeFormat('en-CA', {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    } catch {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    }
}

export function getLastNDateStrings(n: number, timeZone: string): string[] {
    const dayMs = 24 * 60 * 60 * 1000;
    return Array.from({ length: n }, (_, i) => getLocalDateString(new Date(Date.now() - i * dayMs), timeZone));
}
