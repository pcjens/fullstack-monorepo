import { Entry, Gender, NewPatient } from "./types";

export function parseNewPatient(input: unknown): NewPatient {
    if (!input || typeof input !== 'object') {
        throw new Error('new patient data must be provided as an object');
    }

    if (!('name' in input) || !('dateOfBirth' in input) || !('ssn' in input) ||
        !('gender' in input) || !('occupation' in input) || !('entries' in input)) {
        throw new Error('some new patient fields are missing');
    }

    if (!isString(input.name)) {
        throw new Error('name must be a string');
    }
    if (!isString(input.dateOfBirth) || !isDate(input.dateOfBirth)) {
        throw new Error('dateOfBirth must be a date');
    }
    if (!isString(input.ssn)) {
        throw new Error('ssn must be a string');
    }
    if (!isString(input.occupation)) {
        throw new Error('occupation must be a string');
    }
    if (!Array.isArray(input.entries)) {
        throw new Error('entries must be an array');
    }

    return {
        name: input.name,
        dateOfBirth: input.dateOfBirth,
        ssn: input.ssn,
        gender: parseGender(input.gender),
        occupation: input.occupation,
        entries: input.entries.map(parseEntry),
    };
}

export function parseGender(gender: unknown): Gender {
    if (!isString(gender)) {
        throw new Error('gender must be a string');
    }

    switch (gender) {
        case 'female':
            return Gender.Female;
        case 'male':
            return Gender.Male;
        case 'other':
            return Gender.Other;
        default:
            throw new Error(`unrecognized gender '${gender}'`);
    }
}

function isString(maybeString: unknown): maybeString is string {
    return typeof maybeString === 'string';
}

function isDate(maybeDate: string): boolean {
    return Boolean(Date.parse(maybeDate));
}

function parseEntry(maybeEntry: unknown): Entry {
    if (typeof maybeEntry !== 'object') {
        throw new Error('entry must be an object');
    }
    return {};
}
