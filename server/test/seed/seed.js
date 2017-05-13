const {ObjectID} = require('mongodb');
var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');
require('./../../config/config.js');

var todos = [{
  _id: new ObjectID(),
  text: 'First test Todo...'
  }, {
  _id: new ObjectID(),
  text: 'Second test Todo...',
  completed: true,
  completedAt: 333
}];

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var users = [{
  _id: userOneId,
  email: 'userOneId@rydesharing.com',
  password: 'userOnePass',
  tokens: [{
      'access': 'auth',
      'token': jwt.sign({_id: userOneId, access: 'auth'}, process.env.saltSecret).toString()
    }
  ]
},{
  _id: userTwoId,
  email: 'userTwoId@rydesharing.com',
  password: 'userTwoPass'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
