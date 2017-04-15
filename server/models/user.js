const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 5,
        unique : true,
        validate : {
            validator : (value) =>{
                return validator.isEmail(value)
            },
            message : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
         required : true,
         minlength : 6
    },
    tokens : [{
        access :{
            type : String,
            reqire : true
        },
        token : {
            type : String,
            reqire : true
        }
    }]
});


UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token,'secret');

    } catch (error) {
      
    //   return new Promise((resolve, reject) => {
    //       reject(error);
    //});
        return Promise.reject(error);
      
    } 
       return User.findOne({
            _id : decoded._id,
            'tokens.token' : token,
            'tokens.access' : 'auth'
        });
};

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();
    
    return _.pick(userObj,['email','_id']);  
}

UserSchema.methods.generateAuthToken = function(){
    var access = 'auth';
    var idS = this._id.toHexString();
    var token =  jwt.sign({_id : idS, access} ,'secret').toString();
    this.tokens.push({access,token});

    return this.save().then((user)=>{
        return token;
    },(err)=>{
        return err;
    }) 
}

var User = mongoose.model('User',UserSchema);

module.exports = {User};