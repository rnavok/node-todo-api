const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');

const todos = [
    {text:'first item in test'},
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
        .expect(400)
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