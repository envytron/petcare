const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const petsRouter = require('./routes/pets');
const logsRouter = require('./routes/logs');

app.use('/api/pets', petsRouter);
app.use('/api/logs', logsRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'PetCare Log API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
