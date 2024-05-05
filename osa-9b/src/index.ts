import express from 'express';
import qs from 'qs';
import { calculateBmi } from './bmiCalculator';

const app = express();
app.set('query parser', (str: string) => qs.parse(str));

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

const port = 3003;
app.listen(port, () => {
    console.log(`Server listening at: http://localhost:${port}`);
});
