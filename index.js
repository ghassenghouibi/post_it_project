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
app.get('/connexion',urlencodedParser,function (req,res){
    
    dataBase.findUserInDataBase(req.body.Email,req.body.Motdepasse);
    res.render('connexion');
});
app.post('/connexion',function(req,res){
    res.render('connected');    
});

//Inscription post & getd 
app.get('/inscription',function (req,res){
    res.render('inscription');
});
app.post('/inscription',urlencodedParser,function (req,res){
    dataBase.addUserInDataBase(req.body.Nom,req.body.Prenom,req.body.Email,req.body.Motdepasse);
    res.render('inscriptionsuccess');   
    
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