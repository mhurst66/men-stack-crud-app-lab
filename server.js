// Require Statements
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const session = require('express-session')

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
// Import the authController
const authController = require("./controllers/auth.js");
const Item = require("./models/item.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

// Routes

// GET HOME PAGE
app.get("/", async (req, res) => {
    res.render("index.ejs", {
        user: req.session.user,
    })
})
// auth Route
app.use("/auth", authController)

// GET the VIP Lounge
// app.get("/vip-lounge", (req, res) => {
//     if (req.session.user) {
//         res.send(`Welcome to the party ${req.session.user.username}!`)
//     } else {
//         res.send("Sorry, no guests allowed.")
//     }
// })

// GET ROUTES

// Render full database
app.get("/items", async (req, res) => {
  const allItems = await Item.find()
  res.render("items/index.ejs", { items: allItems })
})
// items/new.ejs 
app.get("/items/new", (req, res) => {
  res.render("items/new.ejs")
})
// ANY ID ROUTE NEEDS TO BE PLACED AFTER NEW ROUTES
// SHOW a specific Item
app.get("/items/:itemId", async (req, res) => {
  const foundItem = await Item.findById(req.params.itemId)
  res.render("items/show.ejs", { item: foundItem })
})
// EDIT ROUTE
app.get("/items/:itemID/edit", async (req, res) => {
  const foundItem = await Item.findById(req.params.itemID)
  res.render("items/edit.ejs", {
    item: foundItem,
  })
})

// POST ROUTES
// new item
app.post("/items", async (req, res) => {
  await Item.create(req.body)
  res.redirect("/items")
})

// DELETE ROUTE
app.delete("/items/:itemId", async (req, res) => {
  await Item.findByIdAndDelete(req.params.itemId)
  res.redirect("/items")
})

// UPDATE ROUTE
app.put("/items/:itemId", async (req, res) => {
  // Update the item in the database
  await Item.findByIdAndUpdate(req.params.itemId, req.body)

  // Redirect to the item's show page to see the updates
  res.redirect(`/items/${req.params.itemId}`)
})


// LISTEN FOR THE SERVER
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
