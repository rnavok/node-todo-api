const expect = require('expect');
const request = require('supertest');
var ObjectID = require('mongodb').ObjectID;

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

const idToTest = ObjectID();

const todos = [
    {   _id : idToTest,
        text:'first item in test'},
    {text:'second item in test'}
]

beforeEach((done) => {
    Todo.remove({}).then(()=>{        
        return Todo.insertMany(todos);
    }).then(()=>{done();})
});

describe('POST /todos' , () => {
    it('should create new todo',(done)=> {
        var textToTest = 'walla walla';

        request(app)
        .post('/todos')
        .send({text: textToTest})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(textToTest);
        })
        .end((err,res)=> {
            if(err)
                {return done(err)}
            Todo.find({text: textToTest}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(textToTest);
                done();
            }).catch((err)=> done(err));

        }) 
    });

    it('shouldnt add bad data',(done) =>{
        var badTxt = '';
        request(app)
        .post('/todos')
        .send ({text : badTxt})
        .expect(404)
        .end((err,res)=>{
             if(err)
             {return done(err)}   
        });

        Todo.find({}).then((todos)=>{
            expect(todos.length).toBe(2);
            done();
        }).catch((err) =>{done(err)})
    });  
});

describe('GET /todos' , ()=>{
    it('should fetch 2 items',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            
            expect(res.body.todos.length).toBe(2);
        }).end(done);
    });    
})

describe('GET /todos/:id', () => {
    it('should not return value if id is not valid', (done) => {
        request(app)
        .get('/todos/1234')
        .expect(404)
        .end(done);
    });

    it('should return not found of a valid but not existing id', (done) => {
        request(app)
        .get(`/todos/${ObjectID()}`)
        .expect(404)
        .end(done);
    });

    it('should find one resule and return it', (done) => {
        request(app)
        .get(`/todos/${idToTest}`)
        .expect(200)
        .expect((res) =>{        
            expect(res.body.todo._id).toBe(idToTest.toString())
        })
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should not return value if id is not valid', (done) => {
        request(app)
        .delete('/todos/1234')
        .expect(404)
        .end(done);
    });

    it('should return not found of a valid but not existing id', (done) => {
        request(app)
        .delete(`/todos/${ObjectID()}`)
        .expect(404)
        .end(done);
    });

    it('should delete the given id recored if it exeists', (done) => {
        request(app)
         .delete(`/todos/${idToTest}`)
        .expect(200)
        .expect((res) =>{        
            expect(res.body.todo._id).toBe(idToTest.toString())
        })
        .end((err,res)=>{
            if (err)
                return done(err);

            Todo.findById(idToTest)
            .then((todo)=>{
                expect(todo).toNotExist();
                done();                
            }).catch((err)=>done(err))
            
        });
    });
});