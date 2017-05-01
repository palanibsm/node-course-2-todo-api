const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

var todos = [{
  _id: new ObjectID(),
  text: 'First test Todo'
  }, {
  _id: new ObjectID(),
  text: 'Second test Todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
});

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
