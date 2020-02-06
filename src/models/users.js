const validator=require('validator')
const mongoose=require('mongoose')
const bcyrpt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('../models/tasks')

//middleware is used to control the model pre and post a function is fired ..for example in Router.post users when we save()  before saving we need to hash the plain password provided by the user.Here middleware comes into play
//middleware works on schema so first create a Schema
const userSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,           // so that no other user can create acc with same email
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email is not valid')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        validate(value){
            if(value.length<6)
            {
                throw new Error('Enter password of length greater than 6')
            }
            if(validator.contains(value,'password'))
            {
                throw new Error('password shouldnt conatain password')
            }

        }
        

    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0)
            {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens:[{     //to store the token generated when the user is logged in 
                        //the reason for array of tokens is that suppose you log in from multiple devices so u need multiple tokens 
        token:
        {
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer   //to store the binary form of an image
    }
   
},
{
    timestamps:true  //it shows the time when a user was created and when he was updated
}
)

userSchema.virtual('tasks',{   //to virtually create a link from user to Task
    ref:'Task',
    localField:'_id',   //local id linking to owner id
    foreignField:'owner'
})


//making json function for a specific user to send only relevant data and not passwords
//The res.send() method checks if what we're sending is an object. If it is, then it calls JSON.stringify() on it which in turn calls our toJSON method. 
userSchema.methods.toJSON=function(){  
    const user=this
    const userObject=user.toObject()  //converts this document into plain js object .
    delete userObject.password //removing the password and tokens before sending to the client
    delete userObject.tokens
    delete userObject.avatar
    return userObject 
}

//making the generateAuthToken function to apply on the instances of the model i.e not on all users but a particular user jisne login kiya h
userSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({ _id :user._id.toString()},process.env.JWT_SECRET)    //objectid hasto be converted to string
    user.tokens=user.tokens.concat({token:token})    //to store the generated token into the tokens feild of the model
    await user.save()
     
    return token

}


//making the findByCredentials function so that we can apply it on the model
userSchema.statics.findByCredentials=async(email,password)=>
{
    const user=await User.findOne({email:email})
    if(!user)
    {
        throw new Error('Unable to log in')
    }
    const isMatch=await bcyrpt.compare(password,user.password)
    if(!(isMatch))
    {
        throw new Error('Unable to log in')
    }
    return user
}



//hashing the password before saving
userSchema.pre('save',async function(next){        //hash it before save
    const user=this   //here this gives us access to the individual user that is about to be saved
  if(user.isModified('password'))     // while updating pass has been modified or while creating a new user password has been created then only this will return true
  {
     user.password= await bcyrpt.hash(user.password,8)
  }
  
    next()                                      //next is called after hashing if no next then it will not escape this fn
})


//if user is delete all its tasks erased
userSchema.pre('remove',async function(next)
{
    const user=this
    await Task.deleteMany({owner:user._id})
     next()

})

const User=mongoose.model('User',userSchema)


module.exports=User      //we export the function name not file name