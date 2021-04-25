const User = require('../Models/user');
const token = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleErrors = (err) =>
{
    console.log(err.message, err.code);
};

// Créé un compte
/*
    Fonctionnement :

    1. Validation du mot de passe en passant par une expression régulière
    2. Si le mot de passe et l'adresse email sont valides le mot de passe sera hashé et les infos seront enregistrées dans la db
    3. Si les infos ne sont pas validées, un message d'erreur apparaîtra indiquant le format pris en charge concernant l'email et le mot de passe
*/
exports.signup = (req, res, next) => 
{
    const mdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(req.body.password);

    try
    {
        if (mdp) 
        {
            bcrypt.hash(req.body.password, 10)
            .then(hash => 
                {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });

                    user.save()
                        .then(() => res.status(201).json({ message: "Created account" }))
                        .catch(error => res.status(400).json( handleErrors(error) ));

                }).catch(error => res.status(500).json({ error }));
        } 
        else
        {
            throw new Error("The password must contain at least 8 characters including one uppercase, one lowercase, one number and one special character");
        }
    }
    catch(err)
    {
        return res.status(500).json( handleErrors(err) );
    }
};

// Connexion
/*
    Fonctionnement: 

    1. On recherche une adresse email dans la base de données qui correspond avec l'adresse qui a été saisie depuis le frontend, si aucunne adresse email n'est trouvée, une erreur apparaîtra
    2. Si l'utilisateur est présent dans la db, le mot de passe saisie sera comparé à celui de la base de données qui est lier avec l'adresse email, si le mot de passe est incorrect, une erreur apparaîtra
    3. Si l'utilisateur a été trouver et que le mot de passe est correct, une session sera ouverte pour cet utilisateur
*/
exports.login = (req, res, next) =>
{
    User.findOne({ email: req.body.email }) 
        .then(user => 
        { 
            if (!user)
                return res.status(401).json({ messError: "User not found" });
                
            bcrypt.compare(req.body.password, user.password)
                .then(mdpValid => 
                {
                    if (!mdpValid) 
                        return res.status(401).json({ messError: "Invalid password" })
                
                    return res.status(201).json({
                        userId: user._id, 
                        token: token.sign( 
                            { userId: user._id },
                            process.env.JWT_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                }).catch(error => res.status(500).json({ error }));
                
        }).catch(error => res.status(500).json({ error }));
};