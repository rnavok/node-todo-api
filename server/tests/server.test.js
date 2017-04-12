const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');


beforeEach((done) => {
    Todo.remove({}).then(()=>{done();})
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
            Todo.find().then((todos)=>{
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
        .expect(400)
        .end((err,res)=>{
             if(err)
             {return done(err)}   
        });

        Todo.find({}).then((todos)=>{
            expect(todos.length).toBe(0);
            done();
        }).catch((err) =>{done(err)})
    });  
});