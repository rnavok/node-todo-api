const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcryptjs');

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
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }],
});

UserSchema.pre('save',function(next) {
    var user = this;

    if (user.isModified('password'))
    {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
               user.password = hash;
               next();
            })
        })
    }
     else{
        next();
    }
})

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET);

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

UserSchema.statics.login = function(email,password){
     var User = this;  
  return   User.findOne({email:email}).then((user)=>{
        if (!user)
            Promise.reject();

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res)
                    resolve(user) 
                else
                    reject();                   
            })
    })
    }).catch((err)=>Promise.reject(err));
}

UserSchema.methods.removeToken = function(token){
        var user = this;
        return user.update({
            $pull : {
                tokens : {
                    token : token
                }
            }})       
    }


UserSchema.methods.generateAuthToken = function(){
    var access = 'auth';
    var idS = this._id.toHexString();
    var token =  jwt.sign({_id : idS, access} ,process.env.JWT_SECRET).toString();
    this.tokens.push({access,token});

    return this.save().then((user)=>{
        return token;
    },(err)=>{
        return err;
    }) 
}

var User = mongoose.model('User',UserSchema);

module.exports = {User};