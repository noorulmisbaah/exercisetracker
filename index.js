const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const { save, addExercise, sendUserLog } = require('./util');
require('dotenv').config();

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./users.json'));
  
  res.json(users);
});

app.get('/api/users/:_id/logs', (req, res) => {
  const userLog = sendUserLog(req.params._id);

  res.json(userLog);
})

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const user = save(username);
  
  res.json(user);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const _id = req.params._id;
  const obj = addExercise({ _id, description, duration, date });

  res.json(obj);
});