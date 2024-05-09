import { useEffect, useState } from "react";
import { NonSensitiveDiaryEntry } from "./types";
import DiaryEntrySummary from "./components/DiaryEntrySummary";
import { toArray, toNonSensitiveDiaryEntry } from "./utils";

function App() {
    const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/diaries').then((res) => {
            if (!res.ok) {
                console.error('Got a non-OK result from the server while fetching diary entries.');
                res.text().then((err) => console.error('Non-OK diary entry response: ' + err));
                return;
            }
            res.json().then((json: unknown) => {
                const maybeDiaries = toArray(json);
                const diaries = maybeDiaries.map(toNonSensitiveDiaryEntry);
                setDiaryEntries(diaries);
            });
        });
    }, []);

    return (
        <div>
            <h3>Diary entries</h3>
            {diaryEntries.map((diaryEntry) => (<DiaryEntrySummary key={diaryEntry.id} diaryEntry={diaryEntry} />))}
        </div>
    )
}

export default App;
