const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// CORS
app.use((req, res, next) => 
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// BODY-PARSER
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res) =>
{
    res.json({message: "Réponse du serveur"});
});

module.exports = app;