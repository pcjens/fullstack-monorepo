import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Entry } from "../../types";

interface CareEntriesProps {
    entries: Entry[],
}

const CareEntries = ({ entries }: CareEntriesProps) => {
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
                            <TableCell>{(entry.diagnosisCodes ?? []).join(', ')}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default CareEntries;
