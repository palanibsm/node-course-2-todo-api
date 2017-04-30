var express = require('express');
var bodyParse = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

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
    res.status(404).send('ObjectID is Invalid');
  }
  Todo.findById(id).then((todo) => {
    if (!todo)
    {
      res.status(404).send();
    }
    res.status(200).send({todo});
  }, (e) => {
    res.status(400).send(e);
  })
});
// .catch ((e) => console.log(e));

app.listen(port, () => {
  console.log(`Started on port at ${port}`);
});

module.exports = {app};
