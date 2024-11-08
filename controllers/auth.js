const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const User = require("../models/user.js")

module.exports = router

// Auth Routes
// GET the sign UP page
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs")
})
// GET the sign IN page
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs")
})
// GET sign OUT page
router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})

// POST the user info to database
router.post("/sign-up", async (req, res) => {
    // res.send("Form submission successful")
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
        return res.send("Username Invaild.")
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match!")
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    const user = await User.create(req.body)
    // res.send(`Thanks for signing up ${user.username}`)
    req.session.user = {
        username: user.username,
      };
      
      req.session.save(() => {
        res.redirect("/");
      });      
})

// POST the sign in info to the database (checks if the user has correct credentials)
router.post("/sign-in", async (req, res) => {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.")
    }

    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    )
    if (!validPassword) {
        return res.send("Login failed. Please try again.")
    }

    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to 'req.session.user', do so here!
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    }

    req.session.save(() => {
        res.redirect("/")
    })

})
