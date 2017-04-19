var config = require('./config/config');

const _ = require ('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

var mongoose = require('./db/mongoose').mongoose;
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var auth = require('./middleware/authntication');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',auth.authnticate,(req,res)=>{    
    
    var newTodo = new Todo({
        text: req.body.text,
        _creator : req.user._id
    })
    newTodo.save().then((doc)=>{
        res.send(doc);        
    },(err)=>{        
        res.status(404).send(err);
    })
});


app.get('/todos',auth.authnticate,(req,res)=>{    
    Todo.find({_creator: req.user._id}).then((todos)=>{
        res.send({todos});
    },(err)=>{        
        res.status(404).send();
    });
});

app.get('/todos/:id',auth.authnticate,(req,res)=>{    

    
    if(!ObjectID.isValid(req.params.id))
        return res.status(404).send('invalid id');

    Todo.findOne({_id:req.params.id,_creator : req.user._id}).then((todo)=>{
        if (!todo)
            return res.status(404).send('id not found');
        res.send({todo});
    },(err)=>{
       
        res.status(404).send('id not found');
    });
});


app.delete('/todos/:id',auth.authnticate,(req,res)=>{    

    
    if(!ObjectID.isValid(req.params.id))
        return res.status(404).send('invalid id');

    Todo.findOneAndRemove({_id:req.params.id,_creator : req.user._id}).then((todo)=>{
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

app.patch('/todos/:id',auth.authnticate,(req,res)=>{
    var id =req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send('invalid id');

        
    var body = _.pick(req.body,['text','completed']);
    

    if(_.isBoolean(body.completed) && body.completed){
        
        body.completedAt = new Date().getTime();        
    }else {
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id , _creator: req.user._id},{$set:body},{new :true}).then((todo) => {
        if(!todo){
            return res.status(404).send();        
        }

        return res.send({todo});
    }).catch((err) =>{
          res.status(400).send();  
    })    
});

app.post('/users',(req,res)=>{    
    
    var body = _.pick(req.body,['email','password'])
    var newUser = new User(body)    ;
    
    newUser.save().then((newUser)=>{     
       return newUser.generateAuthToken();
    },(err)=>{
        console.log(`error while adding`,err);
        res.status(400).send(err);
    }).then((token) => {
        res.header('x-auth',token).send(newUser);
    }).catch((err) => {
        console.log(`error while adding`,err);
        res.status(400).send();
    })
});

app.post('/users/login',(req,res) =>{
    var body = _.pick(req.body,['email','password']);
    
         User.login(body.email,body.password).then((user)=>{            
            return user.generateAuthToken().then((token)=>{
                  res.header('x-auth',token).send(user);
            })           
        })
        .catch((err) => {
            console.log(`error while login`,err);
            res.status(400).send();
    })
});

app.get('/users/me',auth.authnticate,(req,res) =>{

    res.send(req.user);
})

app.delete('/users/me/token',auth.authnticate,(req,res) =>{
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });    
})


app.listen(port , ()=> {
    console.log(`server started on port ${port}`);
});

module.exports = {app};
