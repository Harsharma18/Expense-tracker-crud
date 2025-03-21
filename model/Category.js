const mongoose = require("mongoose");
const {Schema} = mongoose;
const categorySchema = new Schema({
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref : "Usermodel",
      required:true,
    },
    name:{
        type:String,
        required:true,
        default:"Uncategorized"

    },
    type:{
     type:String,
     required:true,
    enum:["income","expense"],
    },

},
{
    timestamps:true,
}
)
module.exports = mongoose.model("Categorymodel",categorySchema);