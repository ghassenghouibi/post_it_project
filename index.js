/*--------------------------------------------------------------------Require-Module-----------------------------------------------------------------------------------------*/
const express    =require('express');
const bodyParser =require('body-parser');
const jwt        =require('jsonwebtoken');
const expressJwt =require('express-jwt');
const nodemailer =require('nodemailer');
const DB         =require('./model/utilisateur');
const app        =express();
var   urlencodedParser=bodyParser.urlencoded({extended:false});
const dataBase=new DB();

/*---------------------------------------------------------------------Variables-Globales-------------------------------------------------------------------------------------*/
//Le numéro de Port 
const PORT=8080;
//le secret permet la signature des tokens
const secret='uajzosmehfncozuhtn359S62vefmpw82dL0oz6ozalsovefmpxnw8ozIZSds2dozfsfsfkzef';
//le mail transport préciser le service et {email,motdepasse}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'r2paris8@gmail.com',
        pass: 'sanfara19**'
    }
});
//Les fichiers statiques à utiliser
app.use('/public',express.static('public'));
app.use('/controller',express.static('controller'));
//le view engine c'est le format ejs
app.set('views','./views');
app.set('view engine','ejs');
//sécurisé les routes
app.use(expressJwt({secret:secret}).unless({path:['/','/inscription','/connexion','/home','/password','/motdepasseoublie']}));
/*---------------------------------------------------------------------Routages-----------------------------------------------------------------------------------------------*/

/** Les rêquetes GET
*  @field '/'                 un GET sur la route d'index renvoie la vue index.ejs
*  @field '/inscription'      un GET sur la route d'inscription renvoie la vue inscription.ejs avec un message
*  @field '/connexion'        un GET sur la route de connexion renvoie la vue connexion.ejs 
*  @filed '/home'             un GET sur la route home renvoie la vue home.ejs
*  @field '/home-init'        un GET sur la route home-init renvoie le nombre de post-it de l'utilisateur
*  @field '/home-information' un GET sur la route home chargement des post-it
*  @field '/password'         un GET sur la route password permet de mettre à jour le mot de passe
*/

app.get('/',function (req,res){
   res.status(200).render('index');
});

app.get('/inscription',function (req,res){
    res.status(200).render('inscription',{messagesuccess:'',messagefail:''});
});

app.get('/connexion',function (req,res){
    res.status(200).render('connexion');    
});

app.get('/home',function(req,res){
    res.status(200).render('home');
});

app.get('/home-init',urlencodedParser,function(req,res){
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.nombredePostit(id,function(done){
            res.status(200).json(done);
        });
    });
});

app.get('/home-information',function(req,res){
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.chargerLesPostitDeLaBaseDeDonnees(id,function(done){
            res.status(200).json(done);
        });
    });
});

app.get('/password',function(req,res){
    res.status(200).render('password',{messagefail:''});
});

/** Les rêquetes POST
*  @field '/connexion'         un Post sur la route de connexion permet la recherche du compte de l'utilisateur et renvoie un token si tout c'est bien passé
*  @field '/inscription'       un Post sur la route d'inscription envoie un mail de bienvenue à l'utilisateur ou précise que l'utilisateur à déjà un compte
*  @field '/home-remove'       un Post sur la route de home-remove permet la suppression de post-it renvoie un message Suppression Réussi
*  @field '/home-send'         un Post sur la route de home-send permet l'ajout d'un post-it renvoie un message le Post-it à était ajouté
*  @field '/home-modification' un Post sur la route de home-modification permet la modification du contenu de post-it
*  @field '/motdepasseoublie'  un Post sur la route de mot de passe oublié permet d'envoyer un email de réinitialisation à l'utilisateur
*  @field '/password'          un Post sur la route password permet la mise à jour de mot de passe renvoie à la page de connexion si tous c'est bien passé
*/

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

app.post('/home-remove',urlencodedParser,function(req,res){
    console.log(req.body);
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.SupprimerUnPostIt(id,req.body.idPostit,function(result){
            res.status(200).json("Suppression Réussi");
        });
    });
});

app.post('/home-send',urlencodedParser,function(req,res){
    console.log(req.body);
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.ajouterAlaBaseDeDonnees(id,req.body.idPostit,req.body.coordonneesX,req.body.coordonneesY,req.body.distance,req.body.angle,req.body.text,req.body.couleur,function(result){
            res.status(200).json('le Post-it à était ajouté');
        });
    });
});

app.post('/home-modification',urlencodedParser,function(req,res){
    dataBase.chercherLidDeLutilisateur(req.user.user,function(id){
        dataBase.mettreAjourText(id,req.body.idPostit,req.body.text,function(result){
            res.status(200).json("Le text à était modifier");
        });
    });
});

app.post('/motdepasseoublie',urlencodedParser,function(req,res){
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

app.post('/password',urlencodedParser,function(req,res){
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.status(200).render('password',{messagefail:'Cocher La case recaptcha S\'il vous plaît'});
    }
    else{
        if(req.body.motdepasse1==req.body.motdepasse2){
            dataBase.mettreAjourLecompteUtilisateur(req.body.email,req.body.motdepasse1);
            return res.status(200).render('connexion');
        }else{
            return res.status(200).render('password',{messagefail:'Les deux mots de passe ne ressemble pas !'});
        }
    }
     
});

//Serveur à l'écoute
app.listen(PORT,function(){
    console.log(`listening on port :${PORT}`);
});