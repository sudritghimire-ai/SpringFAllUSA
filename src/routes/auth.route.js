const express = require('express');
const User = require('../model/user.model');
const generateToken = require('../middleware/generatetoken')


const router = express.Router();

module.exports = router;

//creating new userr

router.post("/register",async(req,res) => {
    try{
        const {email,password,username} = req.body;

        const user = new User({email,password,username})
      // //console.log(user)
       await user.save();
       res.status(200).send({
           message:"Registration Complete",
           user:user
       })
       }catch(error){
        console.error("Registration Failed",error);    
        res.status(500).send({
            message:"Registration Failed:"
            
        })
       }
})

//login a user

router.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});

   if(!user){
    return res.status(404).send({
        message:"User not found"
    })
   }

   const isMatch = await user.comparePassword(password)

   if(!isMatch){
    return res.status(401).send({ 
        message:"Invalid Password"
    })
   }

   //todo generate token here
const token = await generateToken(user._id)

//set on browsers cookies

   res.cookie("token",token,{
    httpOnly:true,//enable this only when you have https://
    secure:true,
    samesite:true
   })

console.log(token);






   res.status(200).send({
    message:"Login is successful",
    id:user._id,
    email:user.email,
    username:user.username,
    role:user.role,
    token


   })
        
       
       }catch(error){
        console.error("Filed to login",error);    
        res.status(500).send({
            message:"Failed to login:"
            
        })
       }
})

// logout a user

router.post('/logout' , async(req,res)=>{

    try{

        res.clearCookie('token');
        res.status(200).send({
            message:"Log out is succesful"
        })

    }catch(error){
       console.log("Failed to log out",error);
       res.status(500).json({
        message:"Failed to log out"
       })
    }

})

//get all the users 


router.get('/users',async(req,res) => {
    try{

      const users = await User.find({},'id email role')
      res.status(200).send({
        message : "Users found succesfully",users
      })

    }catch(error){
       console.log("Failed to fetch all users",error);
       res.status(500).json({
        message:"Failed to fetch all users"
       })
    }

})

//delete users from the database


router.delete('/users/:id',async(req,res)=>{
    try{


        const {id} = req.params;
        console.log(id)
        const user = await User.findByIdAndDelete(id);

        if(!user){
            return res.status(404).send({
                message:"Users not found"
            })
        }


        res.status(200).send({
            message:"user deleted succesfully"
        })



    }catch(error){
        console.error("Error deleting user", error);
        res.status(500).json({
            message:"error deleting the user"
        });
    }
})


//update a user role to default or to the admin

router.put('/users/:id',async(req,res) => {
    try{

        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id,{role},{new: true})
        if(!user){
            return res.status(404).send({
                message : "User not found"
            })


        }

        res.status(200).send({
            message:"user updated to admin succesfully",
            user
        })



    }catch(error){
        console.error("Erro updating user role");
        res.status(500).json({
            message:"error upadting user role"
        })
    }
})

module.exports = router;