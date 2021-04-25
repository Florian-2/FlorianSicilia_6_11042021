const express = require('express');
const mongoose = require('mongoose');
const { join } = require('path');
const path = require('path');
require('dotenv').config();

// Routes
const userRoute = require('./Routes/auth_User');
const createSauceRoute = require('./Routes/sauces');

const app = express();

// Connexion à la base de données
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.miyju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
{ 
  	useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

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

// Gère les requêtes sur : /images (dossier)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Gère les requêtes sur : /api/auth et /api/sauces
app.use('/api/auth', userRoute);
app.use('/api/sauces', createSauceRoute);

module.exports = app;