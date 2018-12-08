const express=require('express');
const bodyParser=require('body-parser');
const app=express();
var urlencodedParser=bodyParser.urlencoded({extended:false});
const DB=require('./model/utilisateur');
const dataBase=new DB();
const PORT=8080;

//Pour l'utilisateur des ficheirs statiques
app.use('/public',express.static('public'));

//On précise que nos views sont dans le dossier view et le view engine  c'est le format ejs
app.set('views','./views');
app.set('view engine','ejs');

//La page d'acceuil
app.get('/',function (req,res){
    res.render('index');
});

app.get('/connexion/connected',function (req,res){
    res.render('connected');
});
//Connection post & get
app.get('/connexion',function (req,res){
    res.render('connexion',{message: ''});    
});
app.post('/connexion',urlencodedParser,function(req,res){
    dataBase.chercherLutilisateurDansLabaseDeDonnees(req.body.email,req.body.motdepasse,function(result){
        if(result==0){
            res.render('connexion',{message: 'Email ou mot de passe incorrect'});    
        }
        else{
            res.render('connected');
        }
    });   
});

//Inscription post & get
app.get('/inscription',function (req,res){
    res.render('inscription',{message:''});
});

app.post('/inscription',urlencodedParser,function (req,res){
    dataBase.ajouterUnUtilisateurDansLaBaseDeDonnes(req.body.nom,req.body.prenom,req.body.email,req.body.motdepasse,function(result)
    {
        console.log(result);
        if(result==0){
            res.render('inscription',{message:'l\' adresse email existe déjà'});
        }
        else{
            res.render('inscription',{message:'Votre inscription à était prise en compte'});
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