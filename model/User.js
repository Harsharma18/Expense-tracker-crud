const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type : String,
        required: true,
    }
},{timestamps:true})
const Usermodel = new mongoose.model("Usermodel",userSchema);
module.exports = Usermodel;