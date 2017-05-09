require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParse = require('body-parser');
const {mongoose} = require('./db/mongoose');

var {ObjectID} = require('mongodb');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

app.use(bodyParse.json());

//Create new Todo
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch((e) => {
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

//POST /users - Create new user
app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    // console.log('Stage1',user);
    return user.generateAuthToken();
  }).then((token) => {
      // console.log('Stage2',user);
      res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Handle Authenticated User
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//POST /users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    // res.status(200).send(user);
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
  // res.send(body);
});

//Get /users - Display all users
app.get('/users/', (req, res) => {
  User.find().then((users) => {
    console.log(users);
    res.status(200).send({users});
  }, (e) => {
    res.status(400).send('Error', e);
  })
})

//GET /users:id - Get a User by Id
app.get('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('Object ID is invalid');
  }
  User.findById(id).then((user) => {
    if (!user){
      return res.status(404).send('Id is not found...');
    }
    res.status(200).send(user);
  }, (e) => {
    res.status(400).send(e);
  })
});

//DELETE /users/:id - Delete user by Id
app.delete('/users/:id', (req,res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('ObjectId is Invalid');
  }
  User.findByIdAndRemove(id).then((user) => {
    if (!user){
      return res.status(404).send('Id not found...');
    }
    res.status(200).send(user);
  }, (e) => {
    res.status(400).send(e);
  })
});

//PATCH /users/:id - Update a User by id
app.patch('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send('ObjectId is Invalid...');
  }
  var body = _.pick(req.body, ['email', 'password']);
  User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
    if (!user){
      return res.status(404).send('Id not found...');
    }
    res.status(200).send(user);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.listen(port, () => {
  console.log(`Started on port at ${port}`);
});

module.exports = {app};
