import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Diagnosis, OccupationalHealthcareEntry } from "../../types";

interface Props {
    entry: OccupationalHealthcareEntry,
    diagnoses: Diagnosis[],
}

const OccupationalHealthcareEntryCard = ({ entry, diagnoses }: Props) => {
    return (
        <Box sx={{ minWidth: 640, marginBottom: "2em" }}>
            <Card variant="outlined">
                <CardContent>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell><time>{entry.date}</time></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Specialist</TableCell>
                                <TableCell>{entry.specialist}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Employer</TableCell>
                                <TableCell>{entry.employerName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sick leave</TableCell>
                                <TableCell>
                                    {entry.sickLeave
                                        ? (<span>{entry.sickLeave.startDate} to {entry.sickLeave.endDate}</span>)
                                        : (<span>Not granted</span>)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {!entry.diagnosisCodes || entry.diagnosisCodes.length === 0 ? ''
                        : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Diagnoses</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(entry.diagnosisCodes ?? []).map((code) => {
                                        const diag = diagnoses.find((d) => d.code === code);
                                        return (
                                            <TableRow key={code}>
                                                <TableCell>{code} {diag?.name ?? ''}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    <Box sx={{ margin: "0.5em" }}>
                        <Typography variant="subtitle1">Description</Typography>
                        <Typography variant="body2">{entry.description}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OccupationalHealthcareEntryCard;
