const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('58fe1c465a426c0644a97f29')
  // }).toArray().then((docs) => {
  //   console.log('To Do\'s');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to Fetch the data', err);
  // });

  db.collection('Users').find({
    name: 'Senthil Murugan'
  }).toArray().then((docs) => {
    console.log('To Do\'s');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to Fetch the data', err);
  });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`To Do's Count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to Fetch the data', err);
  // });

  db.close();
});
