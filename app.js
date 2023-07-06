const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose') 
const express = require('express')
const bodyParser = require('body-parser')

dotenv.config();

const shortRoute = require('./routes/shortener')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public/')))

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

app.use(shortRoute);

const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }) //returns a promise
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((err) => console.log(err.message));