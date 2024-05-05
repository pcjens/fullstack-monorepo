import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const { argv } = process;

if (!argv.shift().endsWith('ts-node') || !argv.shift().endsWith('cli.ts')) {
    console.error('Please invoke this script via running:\n\tts-node cli.ts <args>');
    process.exit(2);
}

const subcommand = argv.shift();
switch (subcommand) {
    case 'bmi':
        const heightCm = Number.parseFloat(argv.shift());
        const weightKg = Number.parseFloat(argv.shift());

        if (isNaN(heightCm) || isNaN(weightKg) || argv.length > 0) {
            console.error('Usage:\n\tts-node cli.ts bmi <height-in-cm> <weight-in-kg>');
            process.exit(2);
        }

        console.log(calculateBmi(heightCm, weightKg));
        break;
    case 'exercise':
        const targetDailyHours = Number.parseFloat(argv.shift());
        const dailyExerciseHours = [];
        while (argv.length > 0) {
            dailyExerciseHours.push(Number.parseFloat(argv.shift()));
        }

        if (isNaN(targetDailyHours) || dailyExerciseHours.find((h) => isNaN(h)) != null) {
            console.error('Usage:\n\tts-node cli.ts exercise <target-daily-hours> <daily-exercise-hours>...');
            process.exit(2);
        }

        console.log(calculateExercises(dailyExerciseHours, targetDailyHours));
        break;
    default:
        console.error(`Unrecognized subcommand: ${subcommand}`);
        process.exit(2);
}
