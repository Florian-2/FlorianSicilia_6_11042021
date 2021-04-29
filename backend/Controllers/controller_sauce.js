const Sauces = require('../Models/sauce');
const fileSystem = require('fs');

// Créer une sauce
/*
    Fonctionnement :

    1. Parse les données de la requête (donc le nom, la description, fabricant etc...) et suppression de l'ID "par defaut"
    2. Placement des différentes valeurs dans le schéma concernant la création des sauces
    3. Forme l'URL de l'image, le nom du fichier images est modifié (./multer/multer) pour que le nom du fichier soit unique et correctement formaté
    4. Enregistrement des données dans la base de données
*/
exports.createProducts = (req, res, next) =>
{    
    const sauceObj = JSON.parse(req.body.sauce);

    delete sauceObj._id;

    const sauce = new Sauces({
        ...sauceObj,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
		.then(() => res.status(201).json({ message: "The product has been created"}))
        .catch(error => res.status(400).json({ error }));
};


// Modification du produit
/*
    Fonctionnement :

    1. Deux cas possibles, l'utilisateur a uniquement modifié l'image, ou alors l'utilisateur a uniquement modifié les infos du produit (comme le nom ou la description) 
    2. Si l'image a été modifier, les données (req.body.sauce) seront parser et le chemin de l'image sera mis à jour (exemple : http://localhost:3000/images/nom_du_fichier.jpg)
    3. Si l'image est inchangée et que le contenu a été modifier, les données (....req body) seront enregistrées
*/
exports.updateOneProduct = (req, res, next) =>
{
    const sauceObj = req.file ? { ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : {...req.body};

    Sauces.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id})
        .then(() => res.status(200).json({ message: "The product has been modified" }))
        .catch(err => res.status(400).json({ err }));
};


// Récupérer toutes les sauces
/*
    Fonctionnement :

    1. Récupère toute les données stocker dans la base de données
*/
exports.getAllProducts = (req, res, next) =>
{
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(err => res.status(400).json({ err }));
};


// Récupérer une seule sauce
/*
    Fonctionnement :

    1. Recherche l'identifiant du produit (dans la db) qui correspond à l'identifiant qui est envoyé
    2. Récupère le produit si l'identifiant est le bon, dans le cas contraire une erreur 404 est déclenchée
*/
exports.getOneProduct = (req, res, next) =>
{
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(err => res.status(404).json({ err }));
};


// Supprimer une sauce
/*
    Fonctionnement :

    1. Recherche l'identifiant du produit (dans la db) qui correspond à l'identifiant qui est envoyé
    2. Une fois le produit trouvé, on récupère le chemin de l'image correspond au produit, on split le chemin pour récupérer le nom du fichier et on supprime ce fichier
    3. Une fois que l'image a été supprimer, on supprime le produit en question
*/
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

// Likes - Dislikes
/*
    3 paramètres : 1 0 et -1

    cas 1 : Ajoute le "userId" (identifiant utilisateur) dans le tableau "usersLiked", incrémentes "likes" de 1

    cas 0 : Vérifie que le "userId" soit dans le tableau "usersLiked", si oui on le supprime du tableau et on décrémente "likes" de 1 
            Vérifie que le "userId" soit dans le tableau "usersDisliked", si oui on le supprime du tableau et on décrémente "dislikes" de 1

    cas -1 : Ajoute le "userId" dans le tableau "usersDisliked", incrémente "dislikes" de 1
*/

exports.sauceLikeOrDislike = (req, res, next) => 
{
    const like = req.body.like;
    const user = req.body.userId;

    switch (like) 
    {
        case 1:
            Sauces.updateOne({ _id: req.params.id }, {$push: { usersLiked: user }, $inc: { likes: 1 }})
                .then(() => res.status(200).json({ message: 'like added' }))
                .catch((error) => res.status(400).json({ error }))
            break;

        case -1:
            Sauces.updateOne( { _id: req.params.id }, {$push: { usersDisliked: user }, $inc: { dislikes: 1 }})
                .then(() => { res.status(200).json({ message: 'Dislike added' })})
                .catch((error) => res.status(400).json({ error }))
            break;

        case 0:
            Sauces.findOne({ _id: req.params.id })
                .then((sauce) => 
                {
                    if (sauce.usersLiked.includes(user)) 
                    {
                        Sauces.updateOne({ _id: req.params.id }, { $pull: { usersLiked: user }, $inc: { likes: -1 }})
                            .then(() => res.status(200).json({ message: 'like deletion' }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                    if (sauce.usersDisliked.includes(user)) 
                    {
                        Sauces.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: user }, $inc: { dislikes: -1 }})
                            .then(() => res.status(200).json({ message: 'like deletion' }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                }).catch((error) => res.status(404).json({ error }))
    
        default:
        break;
    }      
};