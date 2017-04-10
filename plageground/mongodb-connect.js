//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');
console.log(new ObjectID());

MongoClient.connect('mongodb://localhost:27017/DotoApp',(error,dbObj)=>{
    if(error)
    {
     return    console.log(`unable to connect ${error}`);

    }


    console.log(`connected to mongo db server`);

    // dbObj.collection('Todos').insertOne({        
    //         text: 'somthing to do',
    //         complited : false
    //     },(error,result) =>{
    //     if (error)
    //     {
    //         return console.log('couldnt add',error);
    //     }
    //         console.log(JSON.stringify(result.ops,undefined,2));
    // })

    dbObj.collection('Users').insertOne({        
            name: 'Ran',
            age : 40,
            location : 'Tel Aviv'
        },(error,result) =>{
        if (error)
        {
            return console.log('couldnt add',error);
        }
            console.log(JSON.stringify(result.ops,undefined,2));
    })

dbObj.close()
})
