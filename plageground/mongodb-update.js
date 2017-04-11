//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/DotoApp',(error,dbObj)=>{
    if(error)
    {
     return  console.log(`unable to connect ${error}`);
    }

    // update one
    // dbObj.collection('Todos').findOneAndUpdate(
    //     {_id :new  ObjectID('58e8b227db17b3256ccf9e7b')},
    //     {$set :{complited : false}},
    //     {returnOriginal : false}
    // ).then((res)=>{
    //     console.log(res);
    // },(err)=>{
    //   console.log('error',err);
    // });


  dbObj.collection('Users').updateMany(
        {name :'Ran'},
        {$set : {name : 'dan'} ,
        $inc : {age:1}}
    ,
        {returnOriginal : false}
    ).then((res)=>{
        console.log(res);
    },(err)=>{
      console.log('error',err);
    });

    // dbObj.close()
})
