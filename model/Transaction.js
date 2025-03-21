const mongoose = require("mongoose");
const {Schema,model} = mongoose;
const transactionSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref : "Usermodel",
    },
    type: {
        type: String,
        required: true,
        enum: ["income", "expense"],
      },
      category: {
        type: String,
        required: true,
        default: "Uncategorized",
      },
    // category:{
    // type:Schema.Types.ObjectId, 
    // ref : "Categorymodel",
    // required:true,
    // },
    amount:{
        type:Number,
        required:true,

    },
    date:{
        type:Date,
         default:Date.now,
    },
    description:{
        type:String,
        default:''
    }
})
module.exports = model("Transactionmodel",transactionSchema);
