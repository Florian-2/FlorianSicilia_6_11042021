const express = require('express');
const mongoose = require('mongoose');
const { join } = require('path');
const path = require('path');

// Routes
const userRoute = require('./Routes/auth_User');
const createSauceRoute = require('./Routes/sauces');

const app = express();

/*
    collection name = users

    mdp Florian : iqw1Gfw3dM5qlePN
    mdp db_Admin : W8g3Kx2VaKLnyM5
*/

// Connexion à la base de données
mongoose.connect(`mongodb+srv://Florian:iqw1Gfw3dM5qlePN@cluster0.miyju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
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

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoute);
app.use('/api/sauces', createSauceRoute);

module.exports = app;