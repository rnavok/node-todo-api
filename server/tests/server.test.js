const expect = require('expect');
const request = require('supertest');
var ObjectID = require('mongodb').ObjectID;

var {app} = require('./../server');
var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
var {idToTest ,todos, populateTodos,populateUsers,users} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


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


describe('PATCH /todos/:id', () => {
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

    it('should update the item and set the time if complited', (done) => {
        var newText = 'the new text';

        request(app)
        .patch(`/todos/${idToTest}`)
        .send({text: newText, completed:true})
        .expect(200)
        .expect((res)=>{            

            expect(res.body.todo.text).toBe(newText);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
                        
        })
        .end(done)        
    });

    it('should update the item and set the time if complited', (done) => {
        var newText = 'the new text';

        request(app)
        .patch(`/todos/${idToTest}`)
        .send({text: newText, completed:false})
        .expect((res)=>{
            expect(res.body.todo.completedAt).toNotExist();
            expect(res.body.todo.completed).toBe(false);                        
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

describe('GET /users/me', () => {
    it('should return a user if authnticated e.g has the token', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)                                                
        })
        .end((err,res)=>{
            if (err)
                done(err);
            else
            done();
        })                    
    });

    it('should return 401 if not authnticated', (done) => {
 request(app)
        .get('/users/me')
       // .set('x-auth',users[0].tokens[0].token)
        .expect(401) 
        .expect((res) =>{
            expect(res.body).toEqual({});
        })       
        .end((err,res)=>{
            if (err)
                done(err);
            else
            done();
        })                    
    });
});

describe('POST /users', () => {
        it('should return new user if all params are good', (done) => {
            var email = 'test1@gmail.com'
            request(app)
            .post('/users')
            .send({password : "helloworldww",email : email})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email)
                expect(res.body._id).toBeA('string')
            })
            .end((err)=>{
                if (err)
                   return done(err);
                
                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.email).toNotBe
                    done();
                }).catch((err)=>{
                    if(err)
                        return done(err);
                })
            })
        });


        it('should return validator errors if request invalid', (done) => {
            request(app)
            .post('/users')
            .send({password : "1234",email : "test2@gmail.com"})
            .expect(400)
            .expect((res)=>{
                expect(res.body._id).toNotExist();

                request(app)
                .post('/users')
                .send({password : "123456789",email : "test2gmail.com"})
                .expect(400)
                .expect((res)=>{
                    expect(res.body._id).toNotExist();
                })
            })
            .end(done)
        });


        it('should not create a user if the email is in use', (done) => {         
            request(app)
            .post('/users')
            .send({password : "12345678",email : "1@gmail.com"})
            .expect(400)
            .expect((res)=>{
                expect(res.body._id).toNotExist();
            })
            .end(done)
    });
});

describe('POST/users/login', () => {
    it('should return a user when giving right password and username', (done) => {
            request(app)
            .post('/users/login')
            .send({password : users[1].password,email : users[1].email})
            .expect(200)
            .expect((res)=>{
                expect(res).toExist();
                expect(res.body.email).toEqual("2@gmail.com");
                expect(res.headers['x-auth'].toExist);
            })
            .end((err,res)=>{
                if(err)
                    return done(err);

                User.findById(res.body._id).then((user)=>{
                    expect(JSON.stringify(user.tokens)).toInclude(res.headers['x-auth']);
                    done();
                }).catch((err)=>{
                    if(err)
                        return done(err);
                })

            })
    });            


    it('should return 400 if user name not exsits', (done) => {
             request(app)
            .post('/users/login')
            .send({password : users[0].password,email : "3@gmail.com"})
            .expect(400)
            .expect((res)=>{
                expect(res).toExist();
                expect(res.body).toEqual({});

            })
            .end(done)
    });

    it('should return 401 if password is wrong', (done) => {
           request(app)
            .post('/users/login')
            .send({password : "password3",email : users[0].email})
            .expect(400)
            .expect((res)=>{
                expect(res.body).toEqual({});

            })
            .end(done)
    });
});

describe('DELETE/ users/me/token', () => {
   it('shoud remove the token from the DB', (done) => {         
        
        request(app)              
        .delete('/users/me/token')                              
        .set('x-auth',users[0].tokens[0].token)  
        .expect(200)
        .expect((res)=>{
            expect(res.body).toEqual({});                        
        })
        .end((err,res) =>{
            if(err){
                return done(err);
            }
            User.findById(users[0]._id).then((user)=>{
            if (user){
                expect(user.tokens.length).toBe(0);
                done();
                }                           
            }).catch((e)=>done(e))
        })        
   })
});
