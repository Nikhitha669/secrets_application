const mongoose = require("mongoose")

const userData = new mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type: String
    }
})

const User = mongoose.model("User", userData)
module.exports = User
