const {handleQuotesCategory,handleQuotesCategorySubmission}= require("../controllers/quotes")
const express = require("express")
const quoteRouter = express();

quoteRouter.get("/",handleQuotesCategory)
quoteRouter.post("/submitChoice",handleQuotesCategorySubmission)


module.exports = quoteRouter