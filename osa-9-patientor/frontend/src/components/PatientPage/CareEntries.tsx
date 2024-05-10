import { Diagnosis, Entry } from "../../types";
import HealthCheckEntryCard from "./HealthCheckEntryCard";
import { assertNever } from "../../utils";
import OccupationalHealthcareEntryCard from "./OccupationalHealthcareEntryCard";
import HospitalEntryCard from "./HospitalEntryCard";

interface CareEntriesProps {
    entries: Entry[],
    diagnoses: Diagnosis[],
}

const CareEntries = ({ entries, diagnoses }: CareEntriesProps) => {
    const sortedEntries = [...entries];
    sortedEntries.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return (
        <div>
            {sortedEntries.map((entry: Entry) => {
                switch (entry.type) {
                    case 'HealthCheck':
                        return (<HealthCheckEntryCard key={entry.id} entry={entry} diagnoses={diagnoses} />);
                    case 'OccupationalHealthcare':
                        return (<OccupationalHealthcareEntryCard key={entry.id} entry={entry} diagnoses={diagnoses} />);
                    case 'Hospital':
                        return (<HospitalEntryCard key={entry.id} entry={entry} diagnoses={diagnoses} />);
                    default:
                        assertNever(entry);
                }
            })}
        </div>
    );
};

export default CareEntries;
