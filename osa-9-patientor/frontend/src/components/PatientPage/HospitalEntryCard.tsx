import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Diagnosis, HospitalEntry } from "../../types";

interface Props {
    entry: HospitalEntry,
    diagnoses: Diagnosis[],
}

const HospitalEntryCard = ({ entry, diagnoses }: Props) => {
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
                                <TableCell>Discharged on</TableCell>
                                <TableCell>{entry.discharge.date}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Reason</TableCell>
                                <TableCell>{entry.discharge.criteria}</TableCell>
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

export default HospitalEntryCard;
