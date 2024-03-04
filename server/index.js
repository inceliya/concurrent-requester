require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));
app.use(express.json());

const port = process.env.PORT || 3001;

function getRandomDelay() {
  return Math.floor(Math.random() * 1000) + 1;
}

const maxRequestsPerSecondCount = 50;
let requestsDuringLastSecondCount = 0;

app.post('/api', async (req, res) => {
  if (requestsDuringLastSecondCount >= maxRequestsPerSecondCount) {
    res.status(429).send('Too Many Requests');
    return;
  }

  requestsDuringLastSecondCount++;

  setTimeout(() => {
    res.json({ index: req.body.index });
  }, getRandomDelay());

  setTimeout(() => {
    requestsDuringLastSecondCount--;
  }, 1000);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});