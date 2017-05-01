require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParse = require('body-parser');
const {mongoose} = require('./db/mongoose');

var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT;

app.use(bodyParse.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET all Todos
app.get('/todos/', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET Todo by Id
app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('ObjectID is Invalid');
  }

  Todo.findById(id).then((todo) => {
    if (!todo)
    {
      return res.status(404).send('Id not found...');
    }
    res.status(200).send({todo});
  }, (e) => {
    res.status(400).send(e);
  })
});

//delete by Id
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Object ID is Invalid');
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){
      return res.status(404).send('Id not found...');
    }
    res.status(200).send({todo});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('Object Id is invalid');
  }
  var body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }
  else {
    body.completedAt = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send('Id not found...');
    }
    res.status(200).send({todo});
  }, (e) => {
    res.status(400).send(e);
  }).catch((e) => res.status(400).send(e));
});

app.listen(port, () => {
  console.log(`Started on port at ${port}`);
});

module.exports = {app};
