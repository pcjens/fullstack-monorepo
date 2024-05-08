import express from 'express';
import patientService from '../services/patientService';
import { parseNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatientsWithoutSsn());
});

router.post('/', (req, res) => {
    try {
        const newPatient = parseNewPatient(req.body);
        const createdPatient = patientService.createPatient(newPatient);
        res.json(createdPatient);
    } catch (err) {
        let errorMessage = 'Failed to create a patient record.';
        if (err instanceof Error) {
            errorMessage += ' Error: ' + err.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;
