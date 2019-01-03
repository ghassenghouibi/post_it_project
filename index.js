const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt');
const nodemailer = require('nodemailer');
const DB=require('./model/utilisateur');
const app=express();
var   urlencodedParser=bodyParser.urlencoded({extended:false});
const PORT=8080;
const dataBase=new DB();

const secret='uajzosmehfncozuhtn359S62vefmpw82dL0oz6ozalsovefmpxnw8ozIZSds2dozfsfsfkzef';

//Mail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'***********',
        pass: '**********'
    }
});

//Les fichiers statiques
app.use('/public',express.static('public'));
app.use('/controller',express.static('controller'));

//On précise que nos views sont dans le dossier view et le view engine  c'est le format ejs
app.set('views','./views');
app.set('view engine','ejs');

//TODO Auth que si on a un token pour la page home
app.use(expressJwt({secret:secret}).unless({path:['/','/inscription','/connexion','/home']}));



/** Les rêquetes GET
 *  @field '/' la page d'index 
 *  @field '/connexion' la page de connexion
 *  @field '/inscription' la page d'inscription
 *  @field '/home.information' route pour chargement des post-it
 *  @field '/password' la page de password
*/

//route d'index
app.get('/',function (req,res){
   res.status(200).render('index');
});
//route d'inscription
app.get('/inscription',function (req,res){
    res.status(200).render('inscription',{messagesuccess:'',messagefail:''});
});
//route de connexion
app.get('/connexion',function (req,res){
    res.status(200).render('connexion');    
});
//route home 
app.get('/home',function(req,res){
    res.status(200).render('home');
});
//route d'information
app.get('/home.information',function(req,res){
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.chargerLesPostitDeLaBaseDeDonnees(id,function(done){
            res.status(200).json(done);
        });
    });
});
//route de modification de mot de passe
app.get('/password',function(req,res){
    res.status(200).render('password',{messagefail:''});
});

/** Les rêquetes POST
 *  @field '/connexion' route de connexion
 *  @field '/inscription' route d'inscription
 *  @field '/home.remove' route de suppression de post-it
 *  @field '/home.send' route de mise à jour de la base de données
 *  @field '/home.modification route de modification du contenu de post-it
 *  @field '/forgotpassword' route de mot de passe oublié
 *  @field '/password' route de mise à jour de mot de passe
*/

//route de connexion envoie un token quand l'utilisateur est bien identifier
app.post('/connexion',urlencodedParser,function(req,res){
    dataBase.chercherLutilisateurDansLabaseDeDonnees(req.body.email,req.body.motdepasse,function(result){
        if(result==0){
            res.status(200).json("Email ou mot de passe incorrect");    
        }
        else{
            const myToken=jwt.sign({iss:"http://localhost:8080/connexion",user:req.body.email,role:"moderator",admin:false},secret);
            res.status(200).json(myToken);
        }
    });   
});
//route d'inscription envoie un mail si tout c'est bien passé
app.post('/inscription',urlencodedParser,function (req,res){
    dataBase.ajouterUnUtilisateurDansLaBaseDeDonnes(req.body.nom,req.body.prenom,req.body.email,req.body.motdepasse,function(result)
    {
        if(result==0){
            res.status(200).render('inscription',{messagefail:'l\'adresse email existe déjà',messagesuccess:''});
        }
        else{
            let mailOptions = {
                from:     'r2paris8@gmail.com',
                to:       req.body.email,
                subject:  'Inscription',
                html:     `Bonjour ${req.body.nom}\n,`+
                          '<p>Bienvenue parmis nous votre inscription est confirmé\n</p> '+
                          `<p> N'oublié pas de poster vos idées chaque jour c'est important ! </p> \n`+
                          '<p>Cordialement L\'équipe de Post It '
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) console.log(error.message);
                else console.log('Email',info.response);
            });
            res.status(200).render('inscription',{messagesuccess:'Votre inscription à était prise en compte',messagefail:''});
        }
    });

});
//route de supprresion de post-it
app.post('/home.remove',urlencodedParser,function(req,res){
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.SupprimerUnPostIt(id,req.body.coordonneesX,req.body.coordonneesY,function(result){
            console.log("résultat de la rêquete Suppression",result);
            res.status(200).json("Suppression Réussi");
        });
    });
});
//route permet de mettre à jour la base de données 
app.post('/home.send',urlencodedParser,function(req,res){
    console.log(req.body);
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.mettreAjourLaBaseDeDonnees(id,req.body.coordonneesX,req.body.coordonneesY,req.body.distance,req.body.angle,req.body.text,req.body.couleur,function(result){
        console.log("résultat de la rêquete mettre à jour",result);
        });
    });
});
//route permet la modification du contenu de post-it
app.post('/home.modification',urlencodedParser,function(req,res){
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.mettreAjourText(id,req.body.text,req.body.coordonneesX,req.body.coordonneesY,function(result){
            console.log("résultat du text -> ",result);
        });
    });
});
//route de mot de passe oublié
app.post('/forgotpassword',urlencodedParser,function(req,res){
    let mailOptions = {
        from:     'r2paris8@gmail.com',
        to:       req.body.Email,
        subject:  'Mot de passe Oublié',
        html:     'Bonjour,\n'+
                  '<p>Pas la peine de vous inquiéter. Vous pouvez réinitialiser votre mot de passe Post it:\n</p> '+
                  `<p> en cliquant sur le lien ci-dessous  <a href="http://localhost:8080/password">Réinitialisation du mot de passe</a> </p> \n`+
                  '<p>Si vous n\'avez pas demandé la réinitialisation de votre mot de passe, supprimez cet e-mail et continuez à poster on s\'occupe de la sécurité!</p>\n'+
                  '<p>Cordialement L\'équipe de Post It '
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error.message);
        else console.log('Email',info.response);
    });
    res.status(200).render('index');
});
//route de mise à jour du mot de passe
app.post('/password',urlencodedParser,function(req,res){
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.render('password',{messagefail:'Cocher La case recaptcha S\'il vous plaît'});
    }
    else{
        if(req.body.motdepasse1==req.body.motdepasse2){
            dataBase.mettreAjourLecompteUtilisateur(req.body.email,req.body.motdepasse1);
            return res.status(200).render('connexion');
        }else{
            return res.render('password',{messagefail:'Les deux mots de passe ne ressemble pas !'});
        }
    }
     
});

//Serveur à l'écoute
app.listen(PORT,function(){
    console.log(`listening on port :${PORT}`);
});