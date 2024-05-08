import express from 'express';
import diagnosisRouter from './routes/diagnoses';

const app = express();
app.use(express.json());

app.get('/api/ping', (_req, res) => {
    res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);

const port = 3001;
app.listen(port, () => {
    console.log(`HTTP server up and running at: http://localhost:${port}/`);
});
