const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
    // console.log(`Result: ${result}`);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
    // console.log(result);
  // });

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
      // console.log(JSON.stringify(result, undefined, 2));
  // });

  // db.collection('Users').deleteMany({name: 'Senthil Murugan'}).then((result) => {
    // console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID("58ff5a24c4d85204ee3d005b")}).then((result) => {
    console.log(result);
  });
  // db.close();
});
