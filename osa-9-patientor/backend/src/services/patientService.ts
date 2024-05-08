import data from "../data/patients";
import { v1 as uuid } from 'uuid';
import { Patient, PatientWithoutSsn, NewPatient } from "../types";

const patients: Patient[] = data;

const getPatientsWithoutSsn = (): PatientWithoutSsn[] => {
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
    getPatientsWithoutSsn,
    createPatient,
};
