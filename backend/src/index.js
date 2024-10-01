require('dotenv').config();
const express = require('express');
const cors = require('cors');
const deviceRoutes = require('./routes/devices');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/devices', deviceRoutes);

app.get('/', (req, res) => {
  res.send('GNSS Device Tracker API');
});

db.connect()
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });