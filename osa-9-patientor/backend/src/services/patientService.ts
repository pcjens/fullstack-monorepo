import data from "../../data/patients";
import { v1 as uuid } from 'uuid';
import { Patient, NonSensitivePatient, NewPatient, EntryWithoutId, Entry } from "../types";

const patients: Patient[] = data;

const getPatient = (id: string): Patient | undefined => {
    return patients.find((patient) => patient.id === id);
};

const getPatientsWithoutSsn = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation,
    }));
};

const createPatient = (patient: NewPatient): Patient => {
    const id = uuid();
    const createdPatient = {
        id,
        ...patient,
    };
    patients.push(createdPatient);
    return createdPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
    const id = uuid();
    const createdEntry = {
        id,
        ...entry,
    };
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) {
        throw new Error('invalid patient id');
    }
    patient.entries.push(createdEntry);
    return createdEntry;
};

export default {
    getPatient,
    getPatientsWithoutSsn,
    createPatient,
    addEntry,
};
