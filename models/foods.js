const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    needToCook: {type: Boolean, default: false}
})

const Food = mongoose.model("Food", foodSchema)

module.exports = Food