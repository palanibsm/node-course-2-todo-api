const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

var {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new Todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err)
        {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  }); //it

  it('Should not create a Todo document', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err)
        {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));

      });//request end
  });//it

}); //describe POST /todos end

//GET Todos
describe('GET /todos', () => {
  it('should get all todos', (done) => {
  request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  });
});

//GET Todos by Id
describe('GET /todos:id', () => {
    it('Should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        }, (e) => {
          console.log(e);
        })
        .end(done);
    });// it close

    it('should return if todo is not not found...', (done) => {
      request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);

    }); //it close

    it('should return 404 if todo is invalid', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}11`)
        .expect(404)
        .end((err) => {
          if (err){
            return done(err);
          }
          done();
        })
      });
  });

  describe('DELETE /todos:id', () => {
    it('should remove a todo document', (done) => {
      var hexId = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }
          Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
      });
    });//end of it

    it('should return 404 if todo not found', (done) => {
      var hexId = new ObjectID().toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if ObjectID is invalid', (done) => {
      var hexId = todos[0]._id.toHexString();
      request(app)
        .delete(`/todos/${hexId}11`)
        .expect(404)
        .end(done);
    });
  });//End of describe

describe('PATCH /todos:id', () => {
  it('should update Todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "Modified First Todo";
    var completed = true;
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });// it ends

  it('should clear CompletedAt when Todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "modified Second todo";
    var completed = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
      })
      .end(done)
  });//it ends

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('shoud return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'bsm@ryde.com';
    var password = 'pass123!!';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a validation if request have errors', (done) => {
    var email = 'abc@ryde.com';
    var password = '123';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email is in use', (done) => {
    var email = users[0].email;
    var password = 'pass123!!';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end((err) => {
        if (err){
          return done(err);
        }
        done();
      });

  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    var email = users[0].email;
    var password = users[0].password;
    request(app)
      .post('/users/login')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          console.log(user.tokens[0]);
          var filteredToken = _.pick(user.tokens[0], ['access', 'token']);
          expect(filteredToken).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    var email = users[1].email;
    var password = users[1].password+1;

    request(app)
      .post('/users/login')
      .send({
        email,
        password
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
