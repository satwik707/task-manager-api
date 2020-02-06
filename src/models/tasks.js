
const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    description:
    {
        type:String,
        required:true,
        trim:true
    },
    status:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'     //to create a reference to the user model ie we can access all the info of user by knowing the owner id first create a reference path..in this case it is the owner .then use populate owner to get the required document from the user model
    }
    
},
{
    timestamps:true
})
const tasks=mongoose.model('Task',userSchema)

module.exports=tasks