const express = require('express');

const mongoose = require('mongoose');

const userRoute = require('./Routes/auth_User');

const app = express();


// Connexion à la base de données
mongoose.connect('mongodb+srv://Florian:iqw1Gfw3dM5qlePN@cluster0.miyju.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

app.use('/api/auth', userRoute);

module.exports = app;