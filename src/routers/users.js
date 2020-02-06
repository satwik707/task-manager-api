const express=require('express')
const Router=new express.Router()
const User=require('../models/users')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const { sendWelcomeEmail ,sendExitEmail}=require('../emails/accounts')
Router.post('/users',async(req,res)=>
{
    const user=new User(req.body)
   

   try{
       await user.save()

       sendWelcomeEmail(user.email,user.name)
       const token=await user.generateAuthToken()

      
       res.status(201).send({user,token})



   }catch(e){
        res.status(400).send(e)
   }

})
Router.post('/users/login',async(req,res)=>
{
    try{
    const user= await User.findByCredentials(req.body.email,req.body.password)             //findByCredentials is not a built-in fn ..this function is made in the model by us
    const token=await user.generateAuthToken()
       //by simply returning the user we are sending users password and list of tokens also.
    //we dont want to send every thing to the client.
    //res.send({user:user.getPublicProfile(),token}) //getPublicProfile is a function made by us to return only user profile data to the user
    res.send({user,token})  //The res.send() method checks if what we're sending is an object. If it is, then it calls JSON.stringify() on it which in turn calls our toJSON method.
    }catch(e)                 //our json method is defined by us in the model
      {
          res.status(404).send(e)
      }
    
})

Router.get('/users/me',auth,async(req,res)=>
{
   /* User.find({}).then((user)=>         //model name should be capital
    {
        res.send(user)
    }).catch(error=>
        {
            resstatus(500).send(error)     //internal server error code
        })  

        try{
            const users=await User.find({})
            res.send(users)

        }catch(e)
        {
            res.status(500).send(e)
        }  */

        res.send(req.user)        //this route will only run when middleware authenticates  ...we already have stored the logged in user in req.user

})  
Router.post('/users/logout',auth,async(req,res)=>
{
    try{
        req.user.tokens=req.user.tokens.filter(token=>
            {
                return token.token!==req.token       //jo token logout wala h usko user ke saare logged in tokens se nikal dya
            })
            await req.user.save()
            res.send()

    }catch(e){
        res.status(500).send()
    }

})
Router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[];

            await req.user.save()
            res.send()
    }catch(e)
    {
        res.status(500).send()
    }

})

Router.patch('/users/me',auth,async(req,res)=> //patch is http route for update
{
    const id=req.user._id
    //supose people give height in the update req.body which is not a feild in user then for that
    const updates=Object.keys(req.body) //object.keys will give the feilds on req.body in an array format
    const allowedupdates=['name','email','password','age']
    const IsValidation=updates.every(update=>                 //by using every we compare each element of updates ..this function returns true if all the elements of updates return true on comparision
        {
            return (allowedupdates.includes(update))
            
        })
        if(!IsValidation)
        {
            return res.status(400).send({error:'invalid updates'})
        }
    try{

        const user=await req.user
        updates.forEach(update=>
            {
                user[update]=req.body[update]    //ussing square brackets inplace of . becuse we dont explicitly know whivh property we have to update it has been dynamically provided by the user
            })
            await user.save()

        
       // const user=await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true}  )   //we provide dynamic updates so we used req.body because we cannot just update name:jessica because what if user wants to update password ..the user can update any feild..the new :true means that after update this is the new user.runvalidator is turned true so that if someone updates his name or something in not a correct format we can validate it 
        //the above query bypasses the middleware hence we cannot use this ..findbyidandupdate works directly with mongoose db hence bypasses the middleware ..same reason we need to provide validators as true
        
        res.send(user)


    }catch(e){
        res.status(500).send(e)

    }
})

Router.delete('/users/me',auth,async(req,res)=>
{
    try{
       await req.user.remove()  //to erase the user in mongoDB
       sendExitEmail(req.user.email,req.user.name)

        
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})
const upload=multer({
        //provide the destination where the file received from the client will be stored here we do not prvide we save the binary form into our model
    limits:{
    fileSize:1000000
    },
    fileFilter:(req,file,cb)=>        //cb is a callback that tells the multer after file upload,file is an object on which several functions can be used ex->to get the file name etc
    {
        if((!file.originalname.endsWith('.jpg'))&&(!file.originalname.endsWith('.png'))&&(!file.originalname.endsWith('.jpeg')))   //we can also use regular expression example-> file.originalname.match(/\.(doc|docx)$/)  //match is used when we use regular expresion in js  
        {
            return cb(new Error('please upload a an image file'))
        }

        cb(undefined,true)    //when file format is correct
        //cb('undefined,false)   //when file format is incorrect ,it silently rejects the file without giving any error
    }
})
Router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>        //upload.single works as a middleware  it is imp that in postman the key is also 'avatar'
{
    //we need to resize the incoming img before saving it to the model
    //here we use sharp for this purpose npm i sharp
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()

    
    res.send()


},(error,req,res,next)=>  //the multer sends a html error ..so inorder to convert html into json we use a callback ..it is imp to use these 4 parameters in cb fn ..so that express knows that it will run if an error occurs
{
    res.status(400).send({error:error.message})
})

Router.delete('/users/me/avatar',auth,async(req,res)=>
{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send()
})

Router.get('/users/:id/avatar',async(req,res)=>
{
    
    const user=await User.findById(req.params.id)
    try{
    if(!user||!user.avatar)
    {
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
    }catch(e)
    {
        res.status(404).send()
    }


}) 


module.exports=Router 