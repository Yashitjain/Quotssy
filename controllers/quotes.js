const {userModel} = require("../models/userQuotes")
const {verifyToken} = require("../service/token")
const {emailSender} = require("../service/email")
var cron = require('node-cron');
const { all } = require("../router/user");

const category=[
"age",
"alone",
"amazing",
"anger",
"architecture",
"art",
"attitude",
"beauty",
"best",
"birthday",
"business",
"car",
"change",
"communication",
"computers",
"cool",
"courage",
"dad",
"dating",
"death",
"design",
"dreams",
"education",
"environmental",
"equality",
"experience",
"failure",
"faith",
"family",
"famous",
"fear",
"fitness",
"food",
"forgiveness",
"freedom",
"friendship",
"funny",
"future",
"god",
"good",
"government",
"graduation",
"great",
"happiness",
"health",
"history",
"home",
"hope",
"humor",
"imagination",
"inspirational",
"intelligence",
"jealousy",
"knowledge",
"leadership",
"learning",
"legal",
"life",
"love",
"marriage",
"medical",
"men",
"mom",
"money",
"morning",
"movies",
"success",
  ].sort()



async function handleQuotesCategory(req,res){
    const payload = verifyToken(req.cookies.token);
    const user = await userModel.findOne({email:payload.email})
    return res.render("choice",{
        category:category,
        userChoice:user.choice,
        interval:ejsTimeFormat(user.interval),
        time:ejsTimeFormat(user.time),
    });
}

async function handleQuotesCategorySubmission(req,res){
    const {username,email} = verifyToken(req.cookies.token)
    const user = await userModel.findOne({username,email});
    const choices = req.body.category;

    if(choices.length === 1) choices = [choices];
    if(choices.length === 0) choices = user.choice;
    await userModel.findOneAndUpdate({email:user.email},{$addToSet:{choice:{$each:choices}},time:req.body.time,interval:req.body.interval});

    return res.redirect("/quoteschoice")
}

async function handleTimeToSendQuotes(){
    const allusers = await userModel.find({});
    allusers.forEach(async element => {
        let userschedule = (element.time).split(':');
        userschedule = `${Number(userschedule[0])}:${Number(userschedule[1])}:${Number(userschedule[2])}`
        let currentTime = new Date();
        currentTime= `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
        console.log(`${currentTime} | ${userschedule} | ${currentTime === userschedule}`)

        if(currentTime === userschedule){
            if (handleSendQuotes(element)) {
                const userInterval = (element.interval).split(":");
                userschedule = userschedule.split(':');
                await userModel.findOneAndUpdate({email:element.email},{time:handleNewSchedule(userschedule,userInterval)})
            };
            return;
        }
        
    });
}

async function handleSendQuotes(user){
    const userChoice = user.choice;
    const category = userChoice[Math.floor(Math.random()*(userChoice.length))]
    const request = require('request');
    request.get({
    url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
    headers: {
        'X-Api-Key': "+cJQL4FqVhIY1JJX0aqMCg==xEbqJWn9MOYJWSGW"
    },
    }, async function(error, response, body) {
        body = JSON.parse(body)
        body = body[0]
    if(error) return console.error('Request failed:', error);
    else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));

    const text = `Quote:${body.quote}\nauthor:${body.author}\nCategory:${body.category}\n\nRegards\n\nQuotsyy`;
    const subject = "Quote of the day"
    const email = user.email;
    emailSender(subject,text,email)
    console.log("email sent");
    });

    return true;
}

    
function handleNewSchedule(schedule,interval){
    const S1=Number(schedule[0]),S2=Number(schedule[1]),S3 = Number(schedule[2])
    const I1=Number(interval[0]),I2=Number(interval[1]),I3 = Number(interval[2])
    const N3 = (S3+I3)%60;
    const N2 = (S2+I2)%60 + Math.floor(((S3+I3)/60));
    const N1 = (S1+I1)%24 + Math.floor(((S2+I2)/60));
    console.log(`${N1}:${N2}:${N3}`);
    return `${N1}:${N2}:${N3}`
}

function ejsTimeFormat(time){
    time = time.split(':')
    let S1=Number(time[0]),S2=Number(time[1]),S3 = Number(time[2])
    if(S1<10) S1 = "0"+S1;
    if(S2<10) S2 = "0"+S2;
    if(S3<10) S3 = "0"+S3;
    return `${S1}:${S2}:${S3}`
}


module.exports = {handleQuotesCategory,handleQuotesCategorySubmission,handleTimeToSendQuotes
}