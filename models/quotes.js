const { type } = require("os")
const {mongoose} = require("./userQuotes")

const schema = {
    quote:{
        type:String,
    },
    author:{
        type:String
    },
    category:{
        type:String
    },
}

const quoteSchema = new mongoose.Schema(schema,{timeStamp:true})
const quoteModel = mongoose.model("Quotes",schema);

module.exports = {quoteModel}