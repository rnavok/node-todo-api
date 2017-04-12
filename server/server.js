var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose').mongoose;
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{    
    
    var newTodo = new Todo({
        text: req.body.text
    }).save().then((doc)=>{
        console.log(`item added ${doc}`);
        res.send(doc);        
    },(err)=>{
        console.log(`error while adding`,err);
        res.status(400).send(err);
    })
});


app.get('/todos',(req,res)=>{    
    Todo.find().then((docs)=>{
        res.send({docs});
    },(err)=>{
        console.log('fatching error',err);
        res.status(400).send(err);
    });
});

app.listen(3000 , ()=> {
    console.log('server started');
});

module.exports = {app};
