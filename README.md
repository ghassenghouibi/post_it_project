# post_it_project

Le  but  de  projet  est  de  disséminer  des  post-it  virtuels  sur  un  repère infinie,Ces  derniers  vont  suivre  les  mouvements  du  curseur  à  l'aide  de  la souris pour être chargé par le navigateur donc chaque utilisateur aura un compte personnel pour noté ces propres idée.

Ce projet aura besoin :

    Base de données:

        https://www.apachefriends.org/fr/download.html
        
        installer et lancer xampp comme ceci : sudo /opt/lampp/lampp start (linux)

        aller sur la page :localhost/phpmyadmin/  se connecter avec :
            user :'root',
            password :''
            créer une base de données qui porte le nom project_post_it
            importer le fichier project_post_it dans le dossier model
    
    Serveur:

    Télécharger node https://nodejs.org/en/download/
    
    Télécharger les modules suivant:
        npm install bcrypt-nodejs body-parser ejs express jsonwebtoken mysql express-jwt nodemailer nodemon --save

    Pour lancer le serveur :
        npm start index.js