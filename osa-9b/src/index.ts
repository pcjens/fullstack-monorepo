import express from 'express';
import qs from 'qs';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.set('query parser', (str: string) => qs.parse(str));
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const { weight, height } = req.query;
    if (typeof weight !== 'string' || typeof height !== 'string') {
        res.status(400).send({ error: 'malformatted parameters' });
        return;
    }

    const heightCm = Number.parseFloat(height);
    const weightKg = Number.parseFloat(weight);
    if (isNaN(heightCm) || isNaN(weightKg)) {
        res.status(400).send({ error: 'malformatted parameters' });
        return;
    }

    res.send({
        weight,
        height,
        bmi: calculateBmi(heightCm, weightKg),
    });
});

app.post('/exercises', (req, res) => {
    if (!('daily_exercises' in req.body) || !('target' in req.body)) {
        res.status(400).send({ error: 'parameters missing' });
        return;
    }

    const { daily_exercises, target } = req.body as { daily_exercises: unknown, target: unknown };

    const dailyExercises: number[] = [];
    if (!Array.isArray(daily_exercises)) {
        res.status(400).send({ error: 'malformatted parameters' });
        return;
    }
    for (const hours of daily_exercises) {
        if (typeof hours === 'number') {
            dailyExercises.push(hours);
        } else if (typeof hours === 'string' && !isNaN(Number.parseFloat(hours))) {
            dailyExercises.push(Number.parseFloat(hours));
        } else {
            res.status(400).send({ error: 'malformatted parameters' });
            return;
        }
    }

    let targetHours;
    if (typeof target === 'number') {
        targetHours = target;
    } else if (typeof target === 'string' && !isNaN(Number.parseFloat(target))) {
        targetHours = Number.parseFloat(target);
    } else {
        res.status(400).send({ error: 'malformatted parameters' });
        return;
    }

    res.send(calculateExercises(dailyExercises, targetHours));
});

const port = 3003;
app.listen(port, () => {
    console.log(`Server listening at: http://localhost:${port}`);
});
