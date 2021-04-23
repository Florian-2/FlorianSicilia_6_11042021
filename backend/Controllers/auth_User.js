const User = require('../Models/user');
const token = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleErrors = (err) =>
{
    console.log(err.message, err.code);
};

// Créé un compte
exports.signup = (req, res, next) => 
{
    bcrypt.hash(req.body.password, 10)
      .then(hash => 
        {
            /*
            console.log(req.body.email.length);
            
            if (req.body.email.length > 6) 
            {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });

                user.save()
                    .then(() => res.status(201).json({ message: 'Compte créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            else
            {
                throw new Error('Email trop court');
            }
            */
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(() => res.status(201).json({ message: "Created account" }))
                .catch(error => res.status(400).json( handleErrors(error) ));

        }).catch(error => res.status(500).json({ error }));
};

// Connexion
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