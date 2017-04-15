const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


// var message = 'i am a message';
// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);


var data = {
    id: 4
};

var token = jwt.sign(data,'123abc');
console.log(token);

var decodedData = jwt.verify(token,'123abc');
console.log(decodedData);

// var token = {
//     data: data,
//     hash : SHA256(JSON.stringify(data)+ 'secret').toString()
// }

// token.data.id = 5;
// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();



// if (resultHash === token.hash)
// {
//     console.log('data wasnt change')
// }else
// {
//     console.log('data was change, dont trust');
// }