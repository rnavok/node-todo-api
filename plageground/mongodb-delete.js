//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/DotoApp',(error,dbObj)=>{
    if(error)
    {
     return  console.log(`unable to connect ${error}`);
    }

    //delete many
    // dbObj.collection('Todos').deleteOne({text:'eat shis'}).then((res)=>{
    //     console.log(res);
    // },(err)=>{
    //   console.log('error',err);
    // });

    //delte one
    // dbObj.collection('Todos').deleteMany({text:'eat shis'}).then((res)=>{
    //     console.log(res);
    // },(err)=>{
    //   console.log('error',err);
    // });
    //find one and delete
    dbObj.collection('Todos').findOneAndDelete({complited : true}).then((res)=>{
        console.log(res);
    },(err)=>{
      console.log('error',err);
    });

    // dbObj.close()
})
