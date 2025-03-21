const jwt = require("jsonwebtoken");
const isAutenticated = async(req , res ,next)=>{
    const headerObj = req.headers;
   const token =  headerObj?.authorization?.split(" ")[1];
   
  
   const verifytoken = jwt.verify(token,"mysecretkey",(err,decode)=>{
    console.log("decoded",decode);
    if(err){
     return false;
    }else{
        return decode;
    }
  
   })

   console.log("verify Token",verifytoken);
   if(verifytoken){
//save user req obj
req.user = verifytoken.id;
next()   }else{
    const err = new Error('Token expire login again');
    next(err);
}
}
module.exports = isAutenticated;