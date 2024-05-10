import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Diagnosis, Entry } from "../../types";

interface CareEntriesProps {
    entries: Entry[],
    diagnoses: Diagnosis[],
}

const CareEntries = ({ entries, diagnoses }: CareEntriesProps) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Diagnoses</TableCell>
                    <TableCell>Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.values(entries).map((entry: Entry) => {
                    return (
                        <TableRow key={entry.id}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>
                                <ul>
                                    {(entry.diagnosisCodes ?? []).map((code) => {
                                        const diag = diagnoses.find((d) => d.code === code);
                                        return (<li key={code}>{code} {diag?.name ?? ''}</li>);
                                    })}
                                </ul>
                            </TableCell>
                            <TableCell>{entry.description}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default CareEntries;
