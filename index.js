const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt');
const nodemailer = require('nodemailer');
const app=express();
var urlencodedParser=bodyParser.urlencoded({extended:false});
const DB=require('./model/utilisateur');
const dataBase=new DB();
const PORT=8080;
const secret='uajzosmehfncozuhtn359S62vefmpw82dL0oz6ozalsovefmpxnw8ozIZSds2dozfsfsfkzef';

//Pour l'utilisateur des ficheirs statiques
app.use('/public',express.static('public'));
app.use('/controller',express.static('controller'));
//TODO Auth que si on a un token pour la page home
//app.use(expressJwt({secret:secret}).unless({path:['/connexion','/inscription','/','/forgotpassword','/home']}));

//On précise que nos views sont dans le dossier view et le view engine  c'est le format ejs
app.set('views','./views');
app.set('view engine','ejs');


//La page d'acceuil
app.get('/',function (req,res){
    res.status(200).render('index');
});
//Connected page

app.get('/home',function(req,res){
    res.status(200).render('home');
});



//Information post & get pour charger les post-it à partir de la base de données
var user="";
app.post('/home.information',urlencodedParser,function(req,res){
    jwt.verify(req.body.token,secret, function(err, decoded) {
        user=decoded.user;
    });
});
app.get('/home.information',urlencodedParser,function(req,res){
    dataBase.chercherLidDeLutilisateur(user,function(id){
        dataBase.chargerLesPostitDeLaBaseDeDonnees(id,function(done){
            res.status(200).json(done);
        });
    });
});

app.post('/home.send',urlencodedParser,function(req,res){
    jwt.verify(req.body.token,secret, function(err, decoded) {
        if(err) throw err;
        else{
            dataBase.chercherLidDeLutilisateur(decoded.user,function(id){
                dataBase.mettreAjourLaBaseDeDonnees(id,req.body.coordonneesX,req.body.coordonneesY,req.body.distance,req.body.angle,req.body.text,req.body.couleur,function(result){
                    console.log("résultat de la rêquete",result);
                    
                });
            });
        }
    });
});
//Connection post & get
app.get('/connexion',function (req,res){
    res.status(200).render('connexion');    
});

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

//Inscription post & get
app.get('/inscription',function (req,res){
    res.render('inscription',{messagesuccess:'',messagefail:''});
});

app.post('/inscription',urlencodedParser,function (req,res){
    dataBase.ajouterUnUtilisateurDansLaBaseDeDonnes(req.body.nom,req.body.prenom,req.body.email,req.body.motdepasse,function(result)
    {
        if(result==0){
            res.status(200).render('inscription',{messagefail:'l\'adresse email existe déjà',messagesuccess:''});
        }
        else{
            res.status(200).render('inscription',{messagesuccess:'Votre inscription à était prise en compte',messagefail:''});
        }
    });

});
//TODO access token {valid : 24 hours}
app.post('/forgotpassword',urlencodedParser,function(req,res){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'***********',
            pass: '**********'
        }
    });
    let mailOptions = {
        from:     '***********',
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



//TODO modifier la route en route sécurisé
app.get('/password',function(req,res){
    res.status(200).render('password',{messagefail:''});
});

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

app.get('/:id',function(req,res){
    res.status(404).render('index');
});

//Serveur à l'écoute
app.listen(PORT,function(){
    console.log(`listening on port :${PORT}`);
});