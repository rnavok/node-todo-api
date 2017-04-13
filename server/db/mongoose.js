var mongoose = require('mongoose');

mongoose.Promise = global.Promise; 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://test:test@ds161190.mlab.com:61190/node-todo-app');


module.exports = {mongoose};