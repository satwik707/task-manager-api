const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

/*
const me=new User({
    name:'Satwik',
    email:'satwik.srivastava707@gmail.com',
    password:'pas',
    age:21
})

me.save().then((me)=>
{
    console.log(me)
}).catch((error)=>
{
    console.log(error)
}) 
*/
/*const tasks=mongoose.model('tasks',{
    description:{
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:Boolean,
        default:false
    }
}) */
/*const task=new tasks({
    description:'coding              ',
    
})

task.save().then(()=>
{
    console.log(task)
}).catch((error)=>
{
    console.log(error)
})*/