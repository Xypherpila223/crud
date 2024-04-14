// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let data = JSON.parse(fs.readFileSync('data.json'));

app.get('/studentaccount', (req, res) => {
  res.json(data);
});

app.post('/studentaccount', (req, res) => {
  const { username, password } = req.body;
  const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  const newStudentAccount = { id, username, password };
  data.push(newStudentAccount);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.status(201).json(newStudentAccount);
});

app.put('/studentaccount/:id', (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  data = data.map(student => (student.id === parseInt(id) ? { ...student, username, password } : student));
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.status(200).json(data.find(student => student.id === parseInt(id)));
});

app.delete('/studentaccount/:id', (req, res) => {
  const { id } = req.params;
  data = data.filter(student => student.id !== parseInt(id));
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
