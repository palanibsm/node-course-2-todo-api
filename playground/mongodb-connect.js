// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(`Object ID: ${obj}`);
// var user = {name: 'Senthil', age: 37};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'My name is Billa',
  //   completed: false
  // }, (err, result) => {
  //   if (err)
  //   {
  //     return console.log('Unable to Insert record', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

//   db.collection('Users').insertOne({
//       name: 'Senthil Murugan',
//       age: 37,
//       location: 'Singapore'
//   }, (err, result) => {
//     if (err)
//     {
//       return console.log('Unable to Insert record');
//     }
//     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
//   });
//
//
  db.close();
});
