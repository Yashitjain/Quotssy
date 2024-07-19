const {userModel} = require("../models/userQuotes")
const {setToken,verifyToken} = require("../service/token")
const {emailSender} = require("../service/email")
let OTP=1110;
let newuser ;

async function handleUserSignin(req,res){
    console.log(req.cookies.token);    
    const userexist = await userModel.findOne({email:req.query.email})
    if(!userexist){
        return res.render("signin",{
            error:"Incorrect Credentials"
        })
    }
    if(userModel.matchUserPassword(req.query.email,req.query.password)){
        const token = setToken((await userModel.findOne({email:req.query.email})).username,req.query.email)
        res.cookie("token",token);
        return res.redirect("/quoteschoice");
    }
    return res.render("signin",{
        error:"incorrect details"
    })
}

async function handleUserSignup(req,res){
    newuser = {email:req.body.email,password:req.body.password,username:req.body.username}
    const userexist = await userModel.findOne({email:req.body.email})
    if(userexist){
        return res.render("signup",{
            error:"Email Id already exists"
        })
    }
    OTP = Math.floor(Math.random(0,1)*10000)
    const subject = "OTP verification for Quotsyy"
    const text = `Hello Dear customer.\nwelcomet to Quotsyy family.\nWe will be proud to make your day great with are wonderfull Quotes.\n\nHere is Your Verification OTP: ${OTP} \n\nRegards\nQuotsyy`
    emailSender(subject,text,req.body.email);
    return res.render("verifyOTP")
}


async function handleVerifyOtp(req,res){    
    if(req.body.otp==OTP){
        await userModel.create(newuser);
        newuser={};
        return res.render("signin")
    } 
    return res.render("verifyOTP",{
        error:"wrong otp"
    });
}

module.exports = {handleUserSignup,handleUserSignin,handleVerifyOtp}