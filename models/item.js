// REQUIRE MONGOOSE TO CREATE SCHEMA
const mongoose = require('mongoose')

// 1. first define the shape of the object we want to store in our database
// this is a SCHEMA

const itemSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, },
    description: { type: String, required: true },
    image: String,
})

// 2. Tell mongoose that the model we want to generate is based off the schema and provide a name to it
// mongoose.model("Name", schema)

const Item = mongoose.model("Item", itemSchema)


// 3. share it with the rest of your application
// module.exports = modelName

module.exports = Item


// Notes
// when we talk about the shape of an object we are talking about the fields and inputs of that object
// this allows us to hold all the data without tons of data structures all over the place
// 
// This is where models make sense each singular model is a different data structure and we hold each model in the folder models!

