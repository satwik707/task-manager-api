const express=require('express')
require('./db/mongoose.js')

const app=express()
const userRouter=require('./routers/users.js')    //earlier we had all the routers of task and users in this file only but we are separating the routes of users and tasks
const taskRouter=require('./routers/tasks.js')

/*app.use((req,res,next)=>          //middleware
{
    if(req.method=='GET')
    {
        res.send('server under maintanance')
    }
    else{
        next()
    }
                                              //next karne k baad hi flow of control middleware se router par jayega varna yahin rahega
})*/

app.use(express.json())    //automatically parse the incoming json into objects so that we can use it 
const port=process.env.PORT

app.use(userRouter)

app.use(taskRouter)
app.listen(port,()=>
{
    console.log('server is up on '+port)
})


//const bcrypt=require('bcryptjs')

/*const myfunction= async()=>
{
    const password="red@12345!"
    const hashedpassword=await bcrypt.hash(password,8)
    console.log(password)
    console.log(hashedpassword)
    const isMatch=await bcrypt.compare(password,hashedpassword)
    console.log(isMatch)
}  



myfunction()*/
/*const jwt=require('jsonwebtoken')
const myfunction=async()=>{
    const token  =jwt.sign({id:'asdasdasdasdasd'},'thisismynewcourse',{expiresIn:'7 days'})      //the second argument is the secret signature
    console.log(token)
    const data=jwt.verify(token,'thisismynewcourse')
    console.log(data)
}

myfunction()*/
//understanding the ref relation between user and task

/*const Task=require('../src/models/tasks')
const myfunction=async()=>
{
    const task=await Task.findById('5e397f566452ed1ad848bea8')
   // const owner= await Task.findById(task.owner)
    await task.populate('owner').execPopulate()        //owner ki id ki jgh uss id ke user ka pura document mil jayega Populate hoga
    console.log(task.owner)


}

myfunction() */

/*const User=require('../src/models/users')
const myfunction=async()=>
{
    const user=await User.findById('5e397edf85dc952a34ec2224')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)  //

}

myfunction()*/

//understanding multer
/*const multer=require('multer')
const upload=multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req,res)=>
{
    res.send()
}) */