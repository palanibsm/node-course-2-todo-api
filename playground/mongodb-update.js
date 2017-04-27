const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5900c13c971f0b1d79330aa8')
  //   },
  //   {
  //     $set: { completed: true }
  //   },
  //   {
  //     returnOriginal: false
  //   }
  //   ).then((result) => {
  //     console.log(result);
  // });
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58fe1e6b9fe77a076f517fdf')
  },
  {
    $set: {
      name: 'Senthil Murugan'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((results) => {
    console.log(results);
  })
  // db.close();
});
