import { NonSensitiveDiaryEntry } from "../types";

interface DiaryEntryProps {
    diaryEntry: NonSensitiveDiaryEntry,
}

const DiaryEntrySummary = (props: DiaryEntryProps) => {
    return (
        <div>
            <h4>{props.diaryEntry.date}</h4>
            <p>
                visibility: {props.diaryEntry.visibility}
                <br />
                weather: {props.diaryEntry.weather}
            </p>
        </div>
    )
};

export default DiaryEntrySummary;
