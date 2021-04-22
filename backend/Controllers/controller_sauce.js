const Sauces = require('../Models/sauce');
const fileSystem = require('fs');

// Créer une sauce
exports.createProducts = (req, res, next) =>
{    
    const sauceObj = JSON.parse(req.body.sauce);

    delete sauceObj._id;

    const sauce = new Sauces({
        ...sauceObj,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
		.then(() => res.status(201).json({ message: "The product has been created"}))
        .catch(error => res.status(400).json({ error }));
};

// Récupérer toutes les sauces
exports.getAllProducts = (req, res, next) =>
{
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(err => res.status(400).json({ err }));
};

// Récupérer une seul sauce
exports.getOneProducts = (req, res, next) =>
{
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(err => res.status(404).json({ err }));
};

// Supprimer un sauce
exports.deleteOneSauce = (req, res, next) => 
{
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => 
        {
            const filename = sauce.imageUrl.split('/images/')[1];

            fileSystem.unlink(`images/${filename}`, () => 
            {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "The product has been removed"}))
                    .catch(err => res.status(400).json({ err }));
            });

        }).catch(err => res.status(500).json({ err }));  
};