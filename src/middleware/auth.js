const jwt=require('jsonwebtoken')
const User=require('../models/users')
const auth=async (req,res,next)=>
{
    try{
        const token=req.header('Authorization').replace('Bearer ','')  //to get the token and remove the bearer keyword
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        //console.log(token)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})   //to grab the user with the id matching and its token matching har ek user ki tokens ki array me tokens hote hain jis jis device se usne login kiya hua h ..tokens:token usnme se koi token agar match kar rha h token k sath
        if(!user)
        {
            throw new Error    //to call the catch block
        }
        req.token=token
        req.user=user   //this can be sent to the router so that router doesnt have to grab the user again
        next()

    }catch{
        res.status(401).send({error:'please authenticate correctly'})
    }
}

module.exports=auth





