const express = require("express")
const {handleUserSignin,handleUserSignup,handleVerifyOtp} = require("../controllers/user")
const userRoute=express();

userRoute.post("/signup",handleUserSignup);
userRoute.get("/signin",handleUserSignin);
userRoute.post("/verification",handleVerifyOtp);
module.exports = userRoute