const express  =  require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandlermiddleware");
const userRouter = require("./routes/userRouters");
const categoryRouter = require("./routes/categoryrouters");
const transactionRouter = require("./routes/transactionrouters");
const app = express();

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/expensetracker')
}
main().then(()=>{
    console.log("database connect successfully");
}).catch((e)=>{
    console.log(e);
})
//!middleware
app.use(express.json());
//!Routers
app.use("/",userRouter);
app.use("/",categoryRouter);
app.use("/",transactionRouter);
//? Error hanler middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { 
    console.log(`Server is listening on ${PORT}`);
});


