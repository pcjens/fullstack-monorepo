import { Alert, Box, Button, Card, CardActions, CardContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DeleteRounded } from '@mui/icons-material';
import { useState } from "react";
import axios from "axios";

import { Diagnosis, EntryWithoutId, Patient } from "../../types";
import patientService from '../../services/patients';

interface Props {
    diagnoses: Diagnosis[],
    patient: Patient,
    setPatient: (arg: React.SetStateAction<Patient | null>) => void,
    setVisible: (arg: React.SetStateAction<boolean>) => void,
}

const EditableCareEntry = ({ diagnoses: _, patient, setPatient, setVisible }: Props) => {
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [rating, setRating] = useState('');
    const [diagnoses, setDiagnoses] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');
    const [addable, setAddable] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const addNewEntry = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setAddable(false);

        try {
            const entry: EntryWithoutId & { type: 'HealthCheck' } = {
                type: 'HealthCheck',
                date,
                specialist,
                healthCheckRating: Number(rating),
                diagnosisCodes: diagnoses,
                description,
            };
            const savedEntry = await patientService.addEntry(patient.id, entry);
            setPatient({
                ...patient,
                entries: (patient.entries ?? []).concat(savedEntry),
            });
            setVisible(false);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(err.response.data);
                } else {
                    setError(err.message);
                }
            } else {
                setError('Something went wrong! ' + err);
            }
            setAddable(true);
        }
    };

    return (
        <Box sx={{ minWidth: 640, marginBottom: "2em" }}>
            <Card variant="outlined" style={{ borderStyle: 'dotted', borderWidth: 6 }}>
                {error != null ? <Alert severity="error">{error}</Alert> : ''}
                <CardContent>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell><TextField variant='standard' placeholder='2000-01-01'
                                    value={date}
                                    onChange={({ target }) => setDate(target.value)} /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Specialist</TableCell>
                                <TableCell><TextField variant='standard' placeholder='Dr. Mario'
                                    value={specialist}
                                    onChange={({ target }) => setSpecialist(target.value)} /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Rating</TableCell>
                                <TableCell><TextField variant='standard' placeholder='2'
                                    value={rating} onChange={({ target }) => setRating(target.value)} /></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Diagnoses</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diagnoses.map((diagnosis, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField variant='standard' placeholder='M51.2'
                                            value={diagnosis}
                                            onChange={({ target }) => {
                                                const newDiagnoses = [...diagnoses];
                                                newDiagnoses.splice(index, 1, target.value);
                                                setDiagnoses(newDiagnoses);
                                            }} />
                                        <IconButton aria-label="delete" onClick={() => {
                                            const newDiagnoses = [...diagnoses];
                                            newDiagnoses.splice(index, 1);
                                            setDiagnoses(newDiagnoses);
                                        }}>
                                            <DeleteRounded />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <Button onClick={() => setDiagnoses(diagnoses.concat(''))}>
                                        Add diagnosis
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Box sx={{ margin: "0.5em" }}>
                        <Typography variant="subtitle1">Description</Typography>
                        <TextField fullWidth multiline variant='outlined' placeholder='The patient looks fine to me!'
                            value={description} onChange={({ target }) => setDescription(target.value)} />
                    </Box>
                </CardContent>
                <CardActions>
                    <Box sx={{ marginLeft: '1em', marginBottom: '1em' }}>
                        <Button variant='contained' disabled={!addable} onClick={(event) => addNewEntry(event)}>Add</Button>
                        <Button variant='text' onClick={() => setVisible(false)}>Close</Button>
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
};

export default EditableCareEntry;
