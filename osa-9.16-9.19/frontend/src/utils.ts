import { NonSensitiveDiaryEntry, Visibility, Weather } from "./types";

export function toArray(maybeArray: unknown): unknown[] {
    if (!Array.isArray(maybeArray)) {
        throw new Error('expected array');
    }
    return maybeArray;
}

export function toNonSensitiveDiaryEntry(maybeDiary: unknown): NonSensitiveDiaryEntry {
    if (!maybeDiary || typeof maybeDiary !== 'object') {
        throw new Error('expected diary entry to be an object');
    }

    if (!('id' in maybeDiary) || !('date' in maybeDiary) ||
        !('weather' in maybeDiary) || !('visibility' in maybeDiary)) {
        throw new Error('diary entry is missing required fields');
    }
    const { id, date, weather, visibility } = maybeDiary;

    if (!isNumber(id)) {
        throw new Error('diary id must be a number');
    }
    if (!isString(date) || !isDate(date)) {
        throw new Error('diary date must be a date');
    }
    if (!isString(weather) || !isWeather(weather)) {
        throw new Error('diary weather must be one of: ' + Object.values(Weather).map((w) => w.toString()).join(', '));
    }
    if (!isString(visibility) || !isVisibility(visibility)) {
        throw new Error('diary visibility must be one of: ' + Object.values(Visibility).map((v) => v.toString()).join(', '));
    }

    return { id, date, weather, visibility };
}

function isNumber(maybe: unknown): maybe is number {
    return typeof maybe === 'number';
}

function isString(maybe: unknown): maybe is string {
    return typeof maybe === 'string';
}

function isDate(maybe: string): boolean {
    return Boolean(Date.parse(maybe));
}

function isWeather(maybe: string): maybe is Weather {
    return Object.values(Weather).map((w) => w.toString()).includes(maybe);
}

function isVisibility(maybe: string): maybe is Visibility {
    return Object.values(Visibility).map((v) => v.toString()).includes(maybe);
}
