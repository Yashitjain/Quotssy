let nodemailer = require("nodemailer")

function emailSender(subject,text,email){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yashitvictus2022@gmail.com',
            pass: 'znmkvfbwagvwtgwl'
        }
        });
    
        var mailOptions = {
        from: 'yashitvictus2022@gmail.com',
        to: email,
        subject: subject,
        text:text
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
}

module.exports = {emailSender}


// "dance, heaven, hurt, inspirational, life, love, sing"