const mongoose = require("mongoose")
const { type } = require("os")
const { createHmac} = require('node:crypto');
const crypto = require('crypto');
const { time } = require("console");
const user = {
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    salt:{
        type:String,
    },
    choice:{
        require:false,
        type:[
            {type:String}
    ]
    },
    time:{
        type:String,
        require:false,
        default:"06:00:00"
    },
    interval:{
        type:String,
        require:false,
        default:"23:59:59"
    }
}

const userSchema = new mongoose.Schema(user,{timestamps:true})

userSchema.pre("save",function(next){
    const user = this;
    if(!user.isModified("password")) return ;
    const salt = crypto.randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashedPassword;
    next();
})

userSchema.static("matchUserPassword",async function(email,password){
    console.log(email,password)
    const user = await this.findOne({"email":email})
    if(!user) return false;
    if(user){
        const hashedPassword = createHmac('sha256',user.salt).update(password).digest("hex");
        return hashedPassword === user.password;
    }
    return false;
})

const userModel = mongoose.model("userQuotes",userSchema);

module.exports={userModel,mongoose}