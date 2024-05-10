import { Alert, Box, Button, Card, CardActions, CardContent, FormControlLabel, IconButton, Input, MenuItem, Radio, RadioGroup, Select, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
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

const EditableCareEntry = ({ diagnoses, patient, setPatient, setVisible }: Props) => {
    const [entryType, setEntryType] = useState<string>('HealthCheck');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [description, setDescription] = useState<string>('');

    // HealthCheck params
    const [rating, setRating] = useState('');

    // Hospital params
    const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
    const [dischargeDate, setDischargeDate] = useState<string>('');

    // OccupationalHealthcare params
    const [employer, setEmployer] = useState<string>('');
    const [sickLeaveEnabled, setSickLeave] = useState<boolean>(false);
    const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>('');
    const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>('');

    const [addable, setAddable] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const addNewEntry = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setAddable(false);

        try {
            let entry: EntryWithoutId;
            switch (entryType) {
                case 'HealthCheck':
                    entry = {
                        type: 'HealthCheck',
                        date,
                        specialist,
                        healthCheckRating: Number(rating),
                        diagnosisCodes,
                        description,
                    };
                    break;
                case 'OccupationalHealthcare': {
                    if (sickLeaveEnabled && (!sickLeaveStartDate || !sickLeaveEndDate)) {
                        throw new Error('Must specify both start and end date for sick leave.');
                    }
                    entry = {
                        type: 'OccupationalHealthcare',
                        date,
                        specialist,
                        diagnosisCodes,
                        description,
                        employerName: employer,
                    };
                    if (sickLeaveEnabled) {
                        entry.sickLeave = {
                            startDate: sickLeaveStartDate,
                            endDate: sickLeaveEndDate,
                        };
                    }
                    break;
                }
                case 'Hospital':
                    entry = {
                        type: 'Hospital',
                        date,
                        specialist,
                        diagnosisCodes,
                        description,
                        discharge: {
                            date: dischargeDate,
                            criteria: dischargeCriteria,
                        }
                    };
                    break;
                default:
                    throw new Error('Entry is not a valid selection, please pick one');
            }
            console.log('sending:', entry);
            const savedEntry = await patientService.addEntry(patient.id, entry);
            console.log('saved:', savedEntry);
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
            } else if (err instanceof Error) {
                setError(err.message);
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
                                <TableCell>Entry</TableCell>
                                <TableCell>
                                    <Select style={{ width: '30ch' }}
                                        value={entryType} onChange={({ target }) => setEntryType(target.value)}>
                                        <MenuItem value='HealthCheck'>Regular checkup</MenuItem>
                                        <MenuItem value='OccupationalHealthcare'>Occupational healthcare visit</MenuItem>
                                        <MenuItem value='Hospital'>Hospital visit</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell><Input type='date' fullWidth
                                    value={date}
                                    onChange={({ target }) => setDate(target.value)} /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Specialist</TableCell>
                                <TableCell><TextField variant='standard' fullWidth placeholder='Dr. Mario'
                                    value={specialist}
                                    onChange={({ target }) => setSpecialist(target.value)} /></TableCell>
                            </TableRow>

                            {entryType !== 'HealthCheck' ? '' : <TableRow>
                                <TableCell>Rating</TableCell>
                                <TableCell>
                                    <RadioGroup row value={rating} onChange={({ target }) => setRating(target.value)}>
                                        <FormControlLabel value='0' control={<Radio />} label='Healthy' />
                                        <FormControlLabel value='1' control={<Radio />} label='Low risk' />
                                        <FormControlLabel value='2' control={<Radio />} label='High risk' />
                                        <FormControlLabel value='3' control={<Radio />} label='Critical risk' />
                                    </RadioGroup>
                                </TableCell>
                            </TableRow>}

                            {entryType !== 'Hospital' ? '' : <TableRow>
                                <TableCell>Discharged on</TableCell>
                                <TableCell><Input type='date' fullWidth
                                    value={dischargeDate}
                                    onChange={({ target }) => setDischargeDate(target.value)} /></TableCell>
                            </TableRow>}
                            {entryType !== 'Hospital' ? '' : <TableRow>
                                <TableCell>For reason</TableCell>
                                <TableCell><TextField variant='standard' fullWidth placeholder='No more symptoms.'
                                    value={dischargeCriteria}
                                    onChange={({ target }) => setDischargeCriteria(target.value)} /></TableCell>
                            </TableRow>}

                            {entryType !== 'OccupationalHealthcare' ? '' : <TableRow>
                                <TableCell>Employer</TableCell>
                                <TableCell><TextField variant='standard' fullWidth placeholder='Tarmon Teräs ja Tärpätti Ab'
                                    value={employer}
                                    onChange={({ target }) => setEmployer(target.value)} /></TableCell>
                            </TableRow>}
                            {entryType !== 'OccupationalHealthcare' ? '' : <TableRow>
                                <TableCell>Sick leave?</TableCell>
                                <TableCell><Switch value={sickLeaveEnabled} onClick={() => setSickLeave(!sickLeaveEnabled)} /></TableCell>
                            </TableRow>}
                            {(entryType !== 'OccupationalHealthcare') ? '' : <TableRow>
                                <TableCell style={{ paddingLeft: '2em' }}>From</TableCell>
                                <TableCell><Input type='date' fullWidth
                                    value={sickLeaveStartDate} disabled={!sickLeaveEnabled}
                                    onChange={({ target }) => setSickLeaveStartDate(target.value)} /></TableCell>
                            </TableRow>}
                            {(entryType !== 'OccupationalHealthcare') ? '' : <TableRow>
                                <TableCell style={{ paddingLeft: '2em' }}>Until</TableCell>
                                <TableCell><Input type='date' fullWidth
                                    value={sickLeaveEndDate} disabled={!sickLeaveEnabled}
                                    onChange={({ target }) => setSickLeaveEndDate(target.value)} /></TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Diagnoses</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diagnosisCodes.map((diagnosis, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Select style={{ minWidth: '30ch' }}
                                            value={diagnosis}
                                            onChange={({ target }) => {
                                                const newDiagnoses = [...diagnosisCodes];
                                                newDiagnoses.splice(index, 1, target.value);
                                                setDiagnosisCodes(newDiagnoses);
                                            }}>
                                            {diagnoses.map(({ code, name }) => (
                                                <MenuItem key={code} value={code}>{code} {name}</MenuItem>
                                            ))}
                                        </Select>
                                        <IconButton aria-label="delete" onClick={() => {
                                            const newDiagnoses = [...diagnosisCodes];
                                            newDiagnoses.splice(index, 1);
                                            setDiagnosisCodes(newDiagnoses);
                                        }}>
                                            <DeleteRounded />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <Button onClick={() => setDiagnosisCodes(diagnosisCodes.concat(''))}>
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
