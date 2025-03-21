const asyncHandler = require("express-async-handler");
const Transactionmodel = require("../model/Transaction");
const Transaction = require("../model/Transaction");
const transactionController = {
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    if (!amount || !type || !date) {
      throw new Error("Type ,amount and date are required");
    }
    //? create
    const transaction = await Transactionmodel.create({
      user: req.user,
      type,
      category,
      amount,
      date,
      description,
    });
    res.json(transaction);
  }),
  //?lists
  getlist: asyncHandler(async (req, res) => {
    // const transaction = await Transactionmodel.find({ user: req.user });
    // res.json(transaction);

    ///filteration 
    const {type,startDate,endDate,category,amount} = req.query;
    let filters = {user:req.user};
    if(type){
        filters.type = type;
    }
    if(startDate){
        filters.date = {...filters.date,$gte:new Date(startDate)};
    }
    if(endDate){
        filters.date = {...filters.date,$lte:new Date(endDate)};
    }
    if (category) {
        if (category === "All") {
          //!  No category filter needed when filtering for 'All'
        } else if (category === "Uncategorized") {
          //! Filter for transactions that are specifically categorized as 'Uncategorized'
          filters.category = "Uncategorized";
        } else {
          filters.category = category;
        }
      }
    if(amount){
        filters.amount = {...filters.amount, $lte:amount};
    }
    const transactionfilter = await Transactionmodel.find(filters).sort({date:-1});
    res.json(transactionfilter);

  }),
  //!update
  update:asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const {type,amount,category,date,description} = req.body;
    //Find the transaction by ID and check if it belongs to the authenticated user
    const transaction = await Transactionmodel.findOne({user:req.user,_id:id});
    if(!transaction){
         throw new Error("transaction not found");
    }
    //Update only the fields that are provided in the request
    transaction.type = type || transaction.type;
  transaction.category = category || transaction.category;
  transaction.amount = amount || transaction.amount;
  transaction.date = date || transaction.date;
  transaction.description = description || transaction.description;
    res.json(transaction);
      //   Save the updated transaction and return the response
  const updatedTransaction = await transaction.save();
  res.json(updatedTransaction);
  }),
  //!delete
    delete:asyncHandler(async(req,res)=>{
    const {id} = req.params;
    // const transaction = await Transactionmodel.findOneAndDelete({user:req.user,_id:id});
    // if(!transaction){
    //     throw new Error("Transaction not found ");
    // }

    //?or
    const transaction = await Transactionmodel.findById(id);
    if(transaction && transaction.user.toString() === req.user.toString()){
        await Transactionmodel.findByIdAndDelete(id);
    }
    res.json({ message: "Transaction deleted successfully" });
  })
};
module.exports = transactionController;
