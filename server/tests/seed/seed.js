const expect = require('expect');
const request = require('supertest');
var ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

//var {app} = require('./../../server');
var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');

const user1IDtoTest = new ObjectID();
const user2IDtoTest = new ObjectID();
const users = [
    {
        _id : user1IDtoTest,
        email : '1@gmail.com',
        password : 'password1',
        tokens : [{
            access : 'auth',
            token :   jwt.sign({_id : user1IDtoTest, access : 'auth'} ,'secret').toString()
        }]
    },{
        _id : user2IDtoTest,
        email : '2@gmail.com',
        password : 'password2',
          tokens : [{
            access : 'auth',
            token :   jwt.sign({_id : user2IDtoTest, access : 'auth'} ,'secret').toString()
        }]
    }
];

const idToTest = new ObjectID();

const todos = [
    {   _id : idToTest,
        text:'first item in test',
        _creator : user1IDtoTest
    },
       {    _id :new ObjectID(),
           text:'second item in test',
       _creator : user2IDtoTest
    }
]

const populateUsers = ((done) => {
    
    User.remove({})
    .then(()=>{        
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        return Promise.all([user1,user2])
    }).then(()=>
    {
        done()});
});

const populateTodos = ((done) => {

    Todo.remove({}).then(()=>{        
        return Todo.insertMany(todos);
    }).then(()=>{done();})
});

module.exports = {idToTest ,todos, populateTodos,populateUsers,users };
