const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const expressJwt=require('express-jwt');
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
//app.use(expressJwt({secret:secret}).unless({path:['/connexion','/inscription','/','/forgotpassword']}));

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

//Forgot Password post

app.post('/forgotpassword',function(req,res){
    res.status(200).render('index');
});

app.get('/:id',function(req,res){
    res.status(404).render('index');
});

//Serveur à l'écoute
app.listen(PORT,function(){
    console.log(`listening on port :${PORT}`);
});