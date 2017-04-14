var config = require('./config/config');

const _ = require ('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

var mongoose = require('./db/mongoose').mongoose;
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{    
    
    var newTodo = new Todo({
        text: req.body.text
    }).save().then((doc)=>{
        console.log(`item added ${doc}`);
        res.send(doc);        
    },(err)=>{
        console.log(`error while adding`,err);
        res.status(404).send(err);
    })
});


app.get('/todos',(req,res)=>{    
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{        
        res.status(404).send(err);
    });
});

app.get('/todos/:id',(req,res)=>{    

    
    if(!ObjectID.isValid(req.params.id))
        return res.status(404).send('invalid id');

    Todo.findById(req.params.id).then((todo)=>{
        if (!todo)
            return res.status(404).send('id not found');
        res.send({todo});
    },(err)=>{
        console.log('fatching error',err);
        res.status(404).send(err);
    });
});


app.delete('/todos/:id',(req,res)=>{    

    
    if(!ObjectID.isValid(req.params.id))
        return res.status(404).send('invalid id');

    Todo.findByIdAndRemove(req.params.id).then((todo)=>{
        if (!todo)
            return res.status(404).send('id not found');
        res.send({todo});
    },(err)=>{
        console.log('fatching error',err);
        res.status(404).send();
    }).catch((e) =>{
        res.status(404).send();
    });
});

app.patch('/todos/:id',(req,res)=>{
    var id =req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send('invalid id');

        
    var body = _.pick(req.body,['text','completed']);
    

    if(_.isBoolean(body.completed) && body.completed){
        
        body.completedAt = new Date().getTime();        
    }else {
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new :true}).then((todo) => {
        if(!todo){
            return res.status(404).send();        
        }

        return res.send({todo});
    }).catch((err) =>{
          res.status(400).send();  
    })    
});

app.listen(port , ()=> {
    console.log(`server started on port ${port}`);
});

module.exports = {app};
