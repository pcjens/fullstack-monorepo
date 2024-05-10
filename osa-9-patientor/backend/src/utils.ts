import { BaseEntry, Diagnosis, Entry, EntryWithoutId, Gender, HealthCheckEntry, HospitalEntry, NewPatient, OccupationalHealthcareEntry } from "./types";

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
    if (!maybeEntry || typeof maybeEntry !== 'object') {
        throw new Error('entry must be an object');
    }

    const withoutId = parseNewEntry(maybeEntry);

    if (!('id' in maybeEntry) || !isString(maybeEntry.id)) {
        throw new Error('entry must have a string id');
    }

    return {
        id: maybeEntry.id,
        ...withoutId,
    };
}

export function parseNewEntry(maybeNewEntry: unknown): EntryWithoutId {
    if (!maybeNewEntry || typeof maybeNewEntry !== 'object') {
        throw new Error('entry must be an object');
    }

    const baseEntry = parseBaseEntryWithoutId(maybeNewEntry);

    if (!('type' in maybeNewEntry) || !isString(maybeNewEntry.type)) {
        throw new Error('entry must have a type field');
    }
    const type = parseEntryType(maybeNewEntry.type);

    switch (type) {
        case 'HealthCheck':
            return {
                type,
                ...baseEntry,
                ...parseHealthCheckEntryPart(maybeNewEntry),
            };
        case 'OccupationalHealthcare':
            return {
                type,
                ...baseEntry,
                ...parseOccupationalHealthcareEntryPart(maybeNewEntry),
            };
        case 'Hospital':
            return {
                type,
                ...baseEntry,
                ...parseHospitalEntryPart(maybeNewEntry),
            };
        default:
            return assertNever(type);
    }
}

function parseBaseEntryWithoutId(maybeEntry: object): Omit<BaseEntry, 'id'> {
    if (!('date' in maybeEntry) || !('specialist' in maybeEntry) || !('description' in maybeEntry)) {
        throw new Error('entry must have fields "date", "specialist", and "description"');
    }

    const { date, specialist, description } = maybeEntry;
    if (!isString(date) || !isDate(date)) {
        throw new Error('date must be a valid date');
    }
    if (!isString(specialist)) {
        throw new Error('specialist must be a string');
    }
    if (!isString(description)) {
        throw new Error('description must be a string');
    }

    const result: Omit<BaseEntry, 'id'> = { date, specialist, description };

    if ('diagnosisCodes' in maybeEntry) {
        result.diagnosisCodes = parseDiagnosisCodes(maybeEntry.diagnosisCodes);
    }

    return result;
}

function parseDiagnosisCodes(maybeDiagnosisCodes: unknown): Array<Diagnosis['code']> {
    if (!Array.isArray(maybeDiagnosisCodes)) {
        throw new Error('diagnosisCodes must be an array');
    }
    // ok to ignore most checks according to the material, not quite implemented
    // the same as in the example because I'd rather operated on the "possible
    // array" rather than the "object containing the possible array"
    return maybeDiagnosisCodes as Array<Diagnosis['code']>;
}

function parseEntryType(type: string): Entry['type'] {
    switch (type) {
        case 'HealthCheck':
        case 'OccupationalHealthcare':
        case 'Hospital':
            return type;
        default:
            throw new Error('unrecognized entry type');
    }
}

function parseHealthCheckEntryPart(entryPart: object): Omit<HealthCheckEntry, 'type' | keyof BaseEntry> {
    if (!('healthCheckRating' in entryPart)) {
        throw new Error('entry missing fields');
    }

    const { healthCheckRating } = entryPart;
    if (typeof healthCheckRating !== 'number' || !([0, 1, 2, 3].includes(healthCheckRating))) {
        throw new Error('healthCheckRating must be a number between 0 and 3');
    }

    return { healthCheckRating };
}

function parseOccupationalHealthcareEntryPart(entryPart: object): Omit<OccupationalHealthcareEntry, 'type' | keyof BaseEntry> {
    if (!('employerName' in entryPart) || !isString(entryPart.employerName)) {
        throw new Error('entry must have the employerName string field');
    }

    const result: Omit<OccupationalHealthcareEntry, 'type' | keyof BaseEntry> = {
        employerName: entryPart.employerName,
    };

    if ('sickLeave' in entryPart) {
        const { sickLeave } = entryPart;
        if (!sickLeave || typeof sickLeave !== 'object') {
            throw new Error('sickLeave must be an object');
        }

        if (!('startDate' in sickLeave) || !('endDate' in sickLeave)) {
            throw new Error('sickLeave must have the startDate and endDate fields');
        }
        const { startDate, endDate } = sickLeave;

        if (!isString(startDate) || !isDate(startDate)) {
            throw new Error('startDate must be a valid date');
        }
        if (!isString(endDate) || !isDate(endDate)) {
            throw new Error('startDate must be a valid date');
        }

        result.sickLeave = { startDate, endDate };
    }

    return result;
}

function parseHospitalEntryPart(entryPart: object): Omit<HospitalEntry, 'type' | keyof BaseEntry> {
    if (!('discharge' in entryPart)) {
        throw new Error('entry must have the discharge field');
    }

    const { discharge } = entryPart;
    if (!discharge || typeof discharge !== 'object') {
        throw new Error('the discharge field must be an object');
    }
    if (!('date' in discharge) || !('criteria' in discharge)) {
        throw new Error('entry is missing fields date and/or criteria');
    }

    const { date, criteria } = discharge;
    if (!isString(date) || !isDate(date)) {
        throw new Error('date must be a valid date');
    }
    if (!isString(criteria)) {
        throw new Error('criteria must be a string');
    }

    return { discharge: { date, criteria } };
}

function assertNever(neverThing: never): never {
    throw new Error('unexpected case: ' + neverThing);
}
