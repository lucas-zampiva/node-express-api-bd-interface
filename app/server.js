require('dotenv').config()

const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const apiRouter = require('./api/routes/apiRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/api', apiRouter)

let port = process.env.PORT || 3000;
app.listen(port);
