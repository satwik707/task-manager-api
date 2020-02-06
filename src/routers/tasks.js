const express=require('express')
const Task=require('../models/tasks.js')
const Router=new express.Router()
const auth=require('../middleware/auth')
const User=require('../models/users')

Router.post('/tasks',auth,async(req,res)=>
{
  //  const tasks=new Task(req.body)
  const tasks=new Task({
      ...req.body,          //es6 spread function ..it spreads the individual contents of array etc
      owner:req.user._id
  })
    /*tasks.save().then(()=>
    {
        res.status(201).send(tasks)
    }).catch(error=>
        {
            res.status(400)
            res.send(error.message)
        })*/

   try{
       await tasks.save()
       res.status(201).send(tasks)
   } catch(e){
       res.status(400).send(e)
   }


})
Router.patch('/tasks/:id',auth,async(req,res)=>
{
    const updates=Object.keys(req.body)
    const allowedupdates=['description','status']
    const IsValidation=updates.every(update=>
        {
            return allowedupdates.includes(update)
        })
    if(!IsValidation)
    {
        return res.status(400).send({error:'Update correct fields'})
    }
    const id=req.params.id
    try{
        const task=await Task.findById({_id:req.params.id,owner:req.user._id})
        if(!task)
        {
            res.status(500).send()
        }
        updates.forEach(update=>
            {
                task[update]=req.body[update]
            })
            await task.save()
       // const task=await Task.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        res.send(task)
    }catch(e)
    {
        res.status(500).send()
    }
})
//GET /tasks?status=false/true
//GET /tasks?limit=3&skip=1  //to show the second page of 3 results ie 4th 5th 6th result 
//GET tasks?sortBy=createdAt:asc/desc
Router.get('/tasks',auth,async(req,res)=>
{
   /* Task.find({}).then(tasks=>
        {
            res.send(tasks)
        }).catch(e=>
            {
                res.status(500).send(e)
            })
            */

    const match={} //blank because if user does not provides any value then display both status tasks
    const status=req.query.status
    if(status)         //GET /tasks?status='true'
    {
        if(status==='true')       //jo query aegi vo string hogi boolean nhi
        {
            match.status=true     //agar true h toh true wale task dikhana h
        }else if(status==='false'){
            match.status=false

        }
    }
    const sort={}
    const parts=req.query.sortBy.split(':')   //createdAt and desc   createdAt:desc
    if(parts)
    {
    sort[parts[0]]=(parts[1]==='desc'?-1:1)  //desc means -1 and asc means 1
    }

    try{
     //const tasks=await Task.find({owner:req.user._id})
     const user= await User.findById(req.user._id)
     await user.populate({
         path:'tasks',
         match:match ,   // vo tasks jinka match 
         options:{       //used for pagination and sorting
            limit:parseInt(req.query.limit),  //convert the string into number because the query we receive from client is in string form
            skip:parseInt(req.query.skip),
            sort:sort
         }
     }).execPopulate()
     
   //  console.log(req.user._id)
     res.send(user.tasks)
    }catch(e)
    {
        res.status(500).send(e)
    }

})
Router.get('/tasks/:id',auth,async(req,res)=>
{
    const id=req.params.id
    //console.log(req.body)
    /*Task.findById(id).then(tasks=>
        {
            if(!tasks)
            {
                return res.status(404).send()
            }
            res.send(tasks)
        }).catch(e=>
            {
                res.status(500).send(e)
            })
            */
        try{
            const task=await Task.findById({_id:id,owner:req.user._id})
            if(!task)
            {
                return res.status(404).send()
            }
          //  console.log(req.body)
            res.send(task)
        }catch(e){
            res.status(500).send(e)
        }
})


Router.delete('/tasks/:id',auth,async(req,res)=>
{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task)
        {
           return res.status(404).send()
        }
        res.send(task)

    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=Router