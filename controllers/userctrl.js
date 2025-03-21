const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Usermodel = require("../model/User");
const jwt = require("jsonwebtoken");
const userController = {
    //!register
    register : asyncHandler(async(req ,res)=>{
        const {username,email,password} = req.body;
        // console.log(req.body);
        //?validate
        if(!username || !email || !password){
            throw new Error("Please fill all fields");
        }
        // check if user already exists
        const existingUser = await Usermodel.findOne({email});
        if(existingUser){
            throw new Error("User already exists");
        }

        //! Hash the password 
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password,salt);
      //*Create the user and save into db
    //   const userCreated = new Usermodel({
    //     username,
    //     email,
    //     password:hashpassword

    //   })//if we want to add multiple field after save and for save we use await userCreated.save();
      const userCreated = await  Usermodel.create({
        username,
        email,
        password:hashpassword

      })
       res.json({
        username:userCreated.username,
        email:userCreated.email,
        id : userCreated._id
       });
    }),

    //!login
    login : asyncHandler(async(req,res)=>{
        //!get the user data
        const {email,password} = req.body;
        //!if email is correct 
        const user = await Usermodel.findOne({email});
        if(!user){
          throw new Error("invalid logi credential");
        }
        //!if password is correct 
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            throw new Error("invalid logi credential");

        }

        //? Generate token
        const token = jwt.sign({id:user._id},"mysecretkey",{expiresIn:"30d"});
        res.json({
            token,
            username:user.username,
            id:user._id,
            email:user.email,
        })



    }),

    //*profile
    profile:asyncHandler(async(req,res)=>{
        // console.log(req.headers);
        //*Find the user 
        const user = await Usermodel.findById(req.user);
        if(!user){
            throw new Error("User not found");

        }
        res.json({
            username:user.username,
            email : user.email,
        })
    }),
    //!change password 
    changePassword: asyncHandler(async(req,res)=>{
        const {oldpassword ,newpassword} = req.body;
        if(!oldpassword || !newpassword){
            throw new Error("Please provide both old and new passwords.")
        }
        const user = await  Usermodel.findById(req.user);
        if (!user) {
            throw new Error("User not found.");
        }

         // Check if old password matches
        const isMatch = bcrypt.compare(oldpassword,user.password);
     
        if (!isMatch) {
            throw new Error("Old password is incorrect.");
        }

        //!Hash the new password
        const salt = await  bcrypt.genSalt(10);
        const hashNewpassword = await bcrypt.hash(newpassword,salt);
        user.password =  hashNewpassword;
        await user.save();
        res.json({
            message: "Password updated successfully",
        });

    }),
    //*update user profile

    updateProfile : asyncHandler(async(req,res)=>{
        const {username,email} = req.body;
        const updateUser = await Usermodel.findByIdAndUpdate(req.user,{
            username,
            email
        },{new:true})

        res.json({
            message: " User Profile update successfully",
        });
    })
    

}
module.exports = userController;