const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const app=express();
var urlencodedParser=bodyParser.urlencoded({extended:false});
const DB=require('./model/utilisateur');
const dataBase=new DB();
const PORT=8080;

//Pour l'utilisateur des ficheirs statiques
app.use('/public',express.static('public'));
app.use('/controller',express.static('controller'));
//On précise que nos views sont dans le dossier view et le view engine  c'est le format ejs
app.set('views','./views');
app.set('view engine','ejs');

//La page d'acceuil
app.get('/',function (req,res){
    res.render('index');
});
//Connected page
app.get('/home',function(req,res){
    //nrmlment le serveur reçoit le token (il voit avec qui on a affaire) sinon il peut le faire refesh s'il veut
    //également il manque la vérification
    res.render('home',{token:'no'});
});
//Connection post & get
app.get('/connexion',function (req,res){
    res.render('connexion',{message: ''});    
});
const secret='uajzosmehfncozuhtn359S62vefmpw82dL0oz6ozalsovefmpxnw8ozIZSds2dozfsfsfkzef';
app.post('/connexion',urlencodedParser,function(req,res){
    dataBase.chercherLutilisateurDansLabaseDeDonnees(req.body.email,req.body.motdepasse,function(result){
        if(result==0){
            res.render('connexion',{message: 'Email ou mot de passe incorrect'});    
        }
        else{
            const myToken=jwt.sign({iss:"http://localhost:8080/connexion",user:req.body.email,role:"moderator",admin:false},secret);
            res.render('home',{token:myToken});
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
        console.log(result);
        if(result==0){
            res.render('inscription',{messagefail:'l\' adresse email existe déjà',messagesuccess:''});
        }
        else{
            res.render('inscription',{messagesuccess:'Votre inscription à était prise en compte',messagefail:''});
        }
    });

});

//Forgot Password post & get
app.get('/forgotpassword',function(req,res){
    res.render('forgotpassword');
});
app.post('/forgotpassword',function(req,res){
    res.render('index');
});

//gèrer tous les autres routes anonymes
app.get('/:id',function(req,res){
    res.render('404error');
});

//Serveur à l'écoute
app.listen(PORT,function(){
    console.log(`listening on port :${PORT}`);
});