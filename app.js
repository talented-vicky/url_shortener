const path = require('path')
const mongoose = require('mongoose') 
const express = require('express')
const bodyParser = require('body-parser')

const dotenv = require('dotenv')
dotenv.config();

const shortRoute = require('./routes/shortener')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(shortRoute);

const port = process.env.port;
const mongoDB_URL = process.env.mongoDB_URL;
mongoose.connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //returns a promise
    .then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
    .catch((err) => console.log(err.message));