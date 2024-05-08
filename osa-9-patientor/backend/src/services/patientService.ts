import data from "../data/patients";
import { Patient, PatientWithoutSsn } from "../types";

const patients: Patient[] = data;

const getPatientsWithoutSsn = (): PatientWithoutSsn[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation,
    }));
};

export default {
    getPatientsWithoutSsn,
};
