import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/ping', (_req, res) => {
    res.send('pong');
});

const port = 3000;
app.listen(port, () => {
    console.log(`HTTP server up and running at: http://localhost:${port}/`);
});
