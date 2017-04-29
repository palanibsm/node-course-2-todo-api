const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '590346f177e8c27e06233f3911';

if (!ObjectID.isValid(id)){
  console.log('Object ID is Invalid');
};

User.findById(id).then((user) => {
  if (!user){
    return console.log('Id not found...');
  }

  console.log('User', JSON.stringify(user, undefined, 2));
})
.catch((e) => console.log(e));

// var id = '590493e22fe282bc1462c1ed';
//
// if (!ObjectID.isValid(id)) {
//   return console.log('Object ID is invalid');
// };
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id)
//   .then((todo) => {
//     if (!todo){
//       return console.log('Id not found...');
//     }
//     console.log('Todo By Id', todo);
//   })
//   .catch((e) => console.log(e));
