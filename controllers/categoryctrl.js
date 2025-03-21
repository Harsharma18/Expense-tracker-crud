const asyncHandler = require("express-async-handler");
const Categorymodel = require("../model/Category");
const Transactionmodel = require("../model/Transaction");
const categoryController = {
 //create
 createCategory: asyncHandler(async(req ,res)=>{
    const {name,type} = req.body;
    if(!name || !type){
        throw new Error("Name and type are requires for create a category");
    }
    const normlizednames = name.toLowerCase();
    const normalizedtypes = type.toLowerCase();
    const validtypes = ["income","expense"];
    if(!validtypes.includes(normalizedtypes)){
        throw new Error("invalid category type"+type);
    }
    //check if category is already exists
    const categoryexists = await  Categorymodel.findOne({
        name:normlizednames,
        user:req.user,
    })
    
    if(categoryexists){
        throw new Error(`${categoryexists.name} already exist`)
    }
      //? create new category
   const category = await Categorymodel.create(
    {
    name:normlizednames,
    user: req.user,
    type:normalizedtypes
   }
)
res.status(200).json(category);
}),
//!lists
listCategories : asyncHandler(async(req,res)=>{
    const category = await Categorymodel.find({user:req.user}).sort({createdAt : -1});
    res.status(200).json(category);
}),
//*update
update:asyncHandler(async(req,res)=>{
    const {name,type} = req.body;
    const {id} = req.params;
    const normlizednames = name.toLowerCase();
    const normalizedtypes = type.toLowerCase();
    const category = await Categorymodel.findById(id);
    if(!category && category.user.toString()!==req.user.toString()){
        throw new Error("Category not found and user not authorized");
    }
    const oldcategory = category.name;
    //update category
    category.name = name;
    category.type = type;
    const updateCategory = await category.save();
    //update after transaction 
    if(oldcategory!== updateCategory){
   await Transactionmodel.updateMany({user:req.user,category:oldcategory},
    {
        $set:{category:updateCategory.name}
    }
   )

    }
    res.json(updateCategory);
    
}),

//!delete
delete:asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const category = await Categorymodel.findById(id);
    if(category && category.user.toString()===req.user.toString()){
     const defaultCategory = "Unauthorized";
     await Transactionmodel.updateMany({
        user:req.user,
        category : category.name,
     },{
       $set:{defaultCategory:category}
     })
 //remove category
 await Categorymodel.findByIdAndDelete(id);
 res.json({message:"category removed and transaction update"});
    }else{
        res.json({message:"category not found or user not authorized"})
    }

   
})

 
 


}
module.exports = categoryController;