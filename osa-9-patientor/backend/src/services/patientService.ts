import data from "../../data/patients";
import { v1 as uuid } from 'uuid';
import { Patient, NonSensitivePatient, NewPatient } from "../types";

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

export default {
    getPatient,
    getPatientsWithoutSsn,
    createPatient,
};
