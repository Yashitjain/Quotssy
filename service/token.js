const jwt = require("jsonwebtoken")
const { consumers } = require("nodemailer/lib/xoauth2")
const key = "77b112608bb04c85a8097d8e4b7334a3"

function setToken(username,email){
    const payload={
        username:username,
        email:email
    }
    return jwt.sign(payload,key)
}

function verifyToken(token){
    if(token) return jwt.verify(token,key)
    
}

module.exports={setToken,verifyToken}