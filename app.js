const express = require("express")
const app = express()
const {mongoose} = require("./models/userQuotes")
const cookieParser = require("cookie-parser")
const {verifyToken} = require("./service/token")
const cron = require("node-cron")
const {handleTimeToSendQuotes} = require("./controllers/quotes")
require('dotenv').config()


//connection
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(()=>"db connected").catch((err)=>console.log("Db connection Error==>",err));

//middleware
var task = cron.schedule("* * * * * *", ()=>{
    handleTimeToSendQuotes
(); 
})
app.use(cookieParser())
app.use(express.urlencoded({extends:false}))


//static
app.set("view engine","ejs");
app.use(express.static('views'))

//routers
const userRoute = require("./router/user")
const quoteRouter = require("./router/quotes")


app.use("/",userRoute);

app.get("/",(req,res,next)=>{
    res.render("signin");
});

app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.use("/quoteschoice",quoteRouter);

const PORT = process.env.PORT || 8004 
app.listen(PORT,()=> {
    task.start()
    console.log("server started")})