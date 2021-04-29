# P6 - Construisez une API sécurisée pour une application d'avis gastronomiques

## Installation

__1.__ `cd frontend` pour se rendre dans le dossier __frontend__

__2.__ `npm install` pour installer les dépendances du __frontend__

__3.__ `cd backend` pour se rendre dans le dossier __backend__

__4.__ `npm install` pour installer les dépendances du __backend__

## Configuration du fichier .env

Dans le dossier __backend__ vous trouverez un fichier [.env.example](backend/.env.example "Redirection vers le fichier .env.example").

Ce fichier est un exemple des informations néccaisaire pour le bon fonctionnement de l'application, notamment pour se connecter à la base de données ou crée un token d'authentification.

Pour utiliser l'application vous devez renseigner vos propres informations.

Pour ce faire remplacer la valeur des variables par votre nom d'utilisateur, mot de passe de votre base de données (MongoDB) et l'accès à cette base :

    # Base de données

    DB_USERNAME=nom_utilisateur
    DB_PASS=mot_de_passe
    DB_ACCES=cluster0.miyju.mongodb.net/exampleDataBaseAcces?retryWrites=true&w=majority

Une fois terminé vous pouvez ensuite renommer le fichier `.env.example` en `.env`

## Lancer l'application

Pour lancer l'application vous devez d'abord lancer le serveur :

__1.__ Rendez-vous dans le dossier __frontend__ puis exécuter cette commande `ng serve` dans une terminal.

__2.__ Rendez-vous dans le dossier __backend__ puis exécuter cette commande `nodemon server` dans un terminal.

__3.__ Ensuite rendez-vous à cette [adresse](http://localhost:4200/ "Redirection vers le fichier .env.example"), 
ou tapper directement `http://localhost:4200/` dans la bar d'adresse de votre navigateur.
