import express from 'express';
import patientService from '../services/patientService';
import { parseNewEntry, parseNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatientsWithoutSsn());
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const patient = patientService.getPatient(id);
    if (patient) {
        res.send(patient);
    } else {
        res.sendStatus(404);
    }
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

router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = parseNewEntry(req.body);
        const createdEntry = patientService.addEntry(req.params.id, newEntry);
        res.json(createdEntry);
    } catch (err) {
        let errorMessage = 'Failed to create a new entry.';
        if (err instanceof Error) {
            errorMessage += ' Error: ' + err.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;
