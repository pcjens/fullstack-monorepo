type Rating = 1 | 2 | 3;

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: Rating,
    ratingDescription: string,
    target: number,
    average: number,
}

export function calculateExercises(dailyExerciseHours: number[], targetHours: number): Result {
    const total = dailyExerciseHours.reduce((accumulator, hours) => accumulator + hours, 0);
    const periodLength = dailyExerciseHours.length;
    const average = total / periodLength;

    let rating: Rating;
    let ratingDescription: string;
    if (average < targetHours * 0.5) {
        rating = 1;
        ratingDescription = 'believe in yourself!';
    } else if (average < targetHours) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        rating = 3;
        ratingDescription = 'great work!';
    }

    return {
        periodLength,
        trainingDays: dailyExerciseHours.filter((hours) => hours > 0).length,
        success: average >= targetHours,
        rating,
        ratingDescription,
        target: targetHours,
        average,
    };
}
