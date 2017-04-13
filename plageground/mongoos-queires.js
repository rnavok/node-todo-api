const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '58ef2de2b17b0628f0cf87901';

Todo.find({
    _id : id
}).then((todos)=>{
    console.log(todos);
},(e)=>{ console.log('err')});

Todo.findOne({
    _id: id
}).then((todo)=>{
console.log(todo);
});

Todo.findById(id)
.then((todo)=>{
    if(!todo)
        return console.log('id not found');
console.log(todo);
}).catch((e)=>{console.log(e)});