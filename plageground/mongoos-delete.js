const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo').Todo;


// Todo.remove({}).then((result)=>{
//     console.log(result);
// })

// Todo.findByIdAndRemove('58ef9a728a5b5e2f38336562').then((todo)=>{
//     console.log(`the item that removed : ${todo}`);
// })

Todo.findOneAndRemove({_id :'58ef9a728a5b5e2f38336562'}).then((todo)=>{
    console.log(`the item that removed : ${todo}`);
})