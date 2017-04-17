var {User} = require('./../models/user');

var authnticate = (req,res,next) =>{

    var token = req.header('x-auth');
      
     User.findByToken(token).then((user) =>{

        if(!user){
            Promise.reject();
        }   
        req.user = user;
        req.token = token;
        next();
     },(e) =>{
         res.status(401).send();
     })
};

module.exports = {authnticate}