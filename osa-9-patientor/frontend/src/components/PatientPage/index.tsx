import { useParams } from "react-router-dom";
import { Diagnosis, Patient } from "../../types";
import { useEffect, useState } from "react";
import patientsService from '../../services/patients';
import { Alert, Box, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import CareEntries from "./CareEntries";

interface PatientPageProps {
    diagnoses: Diagnosis[],
}

const PatientPage = ({ diagnoses }: PatientPageProps) => {
    const params = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) {
            return;
        }
        patientsService.get(params.id)
            .then((responsePatient) => {
                setPatient(responsePatient);
                setLoading(false);
            })
            .catch((err) => {
                if (err instanceof Error) {
                    setError(err.message);
                }
                setLoading(false);
            });
    }, [params.id]);

    if (!params.id) {
        return (<h3>Missing patient id</h3>);
    }
    if (loading) {
        return (<h3>Loading patient information...</h3>);
    }
    if (!patient) {
        return (
            <div>
                <h3>Could not load patient information.</h3>
                {error ? (<Alert severity="error">{error}</Alert>) : ''}
            </div>
        );
    }

    return (
        <div>
            {error ? (<Alert severity="error">{error}</Alert>) : ''}
            <Box>
                <Typography align="center" variant="h6">
                    {patient.name}
                </Typography>
            </Box>
            <Table size={'small'}>
                <TableBody>
                    <TableRow>
                        <TableCell>SSN</TableCell>
                        <TableCell>{patient.ssn}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Born</TableCell>
                        <TableCell>{patient.dateOfBirth}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Gender</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Occupation</TableCell>
                        <TableCell>{patient.occupation}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box marginTop={'2em'}>
                <Typography align="center" variant="h6">
                    Entries
                </Typography>
            </Box>
            {(patient.entries && patient.entries.length > 0)
                ? (<CareEntries entries={patient.entries} diagnoses={diagnoses} />)
                : (<p>No entries.</p>)}
        </div >
    );
};

export default PatientPage;
