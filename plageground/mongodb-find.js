//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/DotoApp',(error,dbObj)=>{
    if(error)
    {
     return  console.log(`unable to connect ${error}`);
    }

    dbObj.collection('Todos').find().count().then((count)=>{
        console.log(`number of items ${count}`);
    },(error)=>{
        return console.log('unable to fatch',error);
    });

    dbObj.collection('Todos').find({complited:false}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
    },(error)=>{
        return console.log('unable to fatch',error);
    });



dbObj.close()
})
