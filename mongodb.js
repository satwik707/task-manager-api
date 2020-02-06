//crud - create read update delete
const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient
const ObjectID=mongodb.ObjectID
//const id=new ObjectID; //it generates a object id
//console.log(id.id)
const connectionURL=process.env.MONGODB_URL //127.0.0.1 is the local host ip and 27017 is the default mongodb port
const databaseName='task-manager'  //database name
mongoClient.connect(connectionURL,{useNewUrlParser:true,useUnifiedTopology: true},(error,client)=>
{
    if(error)
    {
        return console.log('unable to connect')
    }
    const db=client.db(databaseName)   //here in mongodb no need to create database use the database inside this to proceed further
  /*  db.collection('users').insertOne({                 //inserting a collection inside db
        name:'satwik',                           
        age:21
    },(error,result)=>                                 //callback function is called when an operation is completed
    {
        if(error)
        {
            return console.log(error)
        }
            return console.log(result.ops)                   //ops property gives the array of all the documents that we have inserted
    }) */

  /*  db.collection('users').insertMany([
        {
            name:'deepak',
            age:20
        },
        {
            name:'ishan',
            age:19
        }
    ],(error,result)=>
    {   
        if(error)
        {
            return console.log(error)
        }
            return console.log(result.ops)
    }) */

  /*  db.collection('new-tasks').insertMany([
        {
            task:'studying',
            status:false
        },
        {
            task:'playing',
            status:true,
        },
        {
            task:'going to gym',
            status:true
        }
    ],(error,result)=>
    {
        if(error)
        {
            return console.log(error)
        }
        return console.log(result.ops)

    }) */

   /* db.collection('users').findOne({_id:new ObjectID("5df06d1fdbc0d244742e9d24")},(error,result)=>{       //to  find documents by seaching through objectid
        if(error)
        {
            return console.log(error)
        }
        console.log(result)

    })
    //find is different than findOne or insert or insertOne.The reason is that find does not accept a callback function as it does not returns the documents ..it returns a cursor that points to the document
db.collection('users').find({age:21}).toArray((error,users)=>{     //to get an array of documents returned by the curesor we use toArray
    if(error)
    {
        return console.log(error)
    }
    console.log(users)

})
db.collection('users').find({age:21}).count((error,count)=>{     //to get a count of the documents stored.This is where cursors are used .It directly fetched us the count instead of first loading it into the node
    if(error)
    {
        return console.log(error)
    }
    console.log(count)

}) */
/* db.collection('new-tasks').findOne({_id:new ObjectID('5df1e79d8d900925702edb4d')},(error,result)=>
{
    if(error)
    {
        return console.log(error)
    }
    console.log(result)
})
db.collection('new-tasks').find({status:false}).toArray((error,users)=>
{
    if(error)
    {
        return console.log(error)
    }
    console.log(users)
})
*/
/*db.collection('users').updateOne({
    _id:new ObjectID("5df1db37246744330c7eb74a")
},
{
    $set:{
        name:'abhinav'
    }
}).then((result)=>
{
    console.log(result)
}).catch(()=>
{
    console.log(error)
}) */

/*db.collection('users').updateOne({
    _id:new ObjectID("5df1db37246744330c7eb74a")
},
{
    $set:{
        name:'Mark'
    }
},(error,result)=>                        //used callback here for the same function which is done above using promise
{
    console.log(result)
})*/


/*db.collection('new-tasks').updateMany({
    status:false
},
{
    $set:{
        status:true
    }
}).then((result)=>
{
    console.log(result)
}).catch((error)=>
{
    console.log(error)
})*/

db.collection('new-tasks').deleteOne({
    task:'playing'
}).then((result)=>
{
    console.log(result)
}).catch((error)=>
{
    console.log(error)
})

}) 

