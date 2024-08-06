const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('../knexfile');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const db = knex(knexConfig.development);

app.use((req, res, next) => {
  req.db = db;
  next();
});

console.log('Available routes:', apiRoutes.stack.map(r => r.route?.path).filter(Boolean));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Management API');
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});