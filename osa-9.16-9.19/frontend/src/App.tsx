import { useEffect, useState } from "react";
import { NonSensitiveDiaryEntry } from "./types";
import DiaryEntrySummary from "./components/DiaryEntrySummary";
import { toArray, toNonSensitiveDiaryEntry } from "./utils";

const DIARIES_API_URL = 'http://localhost:3000/api/diaries';

function App() {
    const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);

    const [inputDate, setInputDate] = useState('');
    const [inputVisibility, setInputVisibility] = useState('');
    const [inputWeather, setInputWeather] = useState('');
    const [inputComment, setInputComment] = useState('');
    const [formLocked, setFormLocked] = useState(false);

    useEffect(() => {
        fetch(DIARIES_API_URL).then((res) => {
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

    const submitNewDiary = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setFormLocked(true);

        const newDiaryEntry = {
            date: inputDate,
            visibility: inputVisibility,
            weather: inputWeather,
            comment: inputComment,
        };
        fetch(DIARIES_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDiaryEntry)
        }).then((res) => {
            if (!res.ok) {
                res.text().then((err) => {
                    console.error('The non-OK response from the diary entry creation endpoint: ' + err);
                });
                console.error('Failed to create new diary entry, was:', newDiaryEntry);
                throw new Error('Got a non-OK response from the diary entry creation endpoint');
            }
            res.json().then((json) => {
                const newDiaryEntry = toNonSensitiveDiaryEntry(json);
                setDiaryEntries(diaryEntries.concat(newDiaryEntry));

                setInputDate('');
                setInputVisibility('');
                setInputWeather('');
                setInputComment('');
                setFormLocked(false);
            });
        }).catch((err: Error) => {
            console.error('Error adding diary entry:', err);
            setFormLocked(false);
        });
    }

    return (
        <div>
            <h3>Add new entry</h3>
            <form onSubmit={submitNewDiary}>
                date <input
                    value={inputDate}
                    onChange={({ target }) => setInputDate(target.value)} />
                <br />
                visibility <input
                    value={inputVisibility}
                    onChange={({ target }) => setInputVisibility(target.value)} />
                <br />
                weather <input
                    value={inputWeather}
                    onChange={({ target }) => setInputWeather(target.value)} />
                <br />
                comment <input
                    value={inputComment}
                    onChange={({ target }) => setInputComment(target.value)} />
                <br />
                <button type="submit" disabled={formLocked}>add</button>
            </form>
            <h3>Diary entries</h3>
            {diaryEntries.map((diaryEntry) => (<DiaryEntrySummary key={diaryEntry.id} diaryEntry={diaryEntry} />))}
        </div>
    )
}

export default App;
