require('dotenv').config()

const express = require('express')
const chalk = require('chalk')
const mongoose = require('mongoose')
const session = require('express-session')

// Load our localized configure version
const passport = require('./config/passport')


const app = express()
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

const sessionSettings = {
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: false
}
// configure with passport
app.use(session(sessionSettings))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// default items, we might require logins on certain pieces
// using middleware in the future
const ensureLoginOrRedirect = (req, res, next) => {
  console.log(req.path);
  console.log(req.user);
  if(!req.user && req.path === "/"){
    console.log("test");
    return res.redirect('/login.html')
  } else {
    return next();
  }
}

// simple login routes
app.post('/api/login',
  passport.authenticate('local'),
  (req, res) => {
    console.log("test");
    return res.json({success: true})
})

app.get('/api/logout', (req, res) => {
  req.logout()
  res.redirect('/');
})

app.use(ensureLoginOrRedirect, express.static('client/public'))
app.listen( PORT, () => console.log(chalk.bgRed(`Listening on PORT :${PORT}`)) ) // eslint-disable-line no-console
