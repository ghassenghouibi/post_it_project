const express=require('express');
const bodyParser=require('body-parser');
const app=express();

var urlencodedParser=bodyParser.urlencoded({extended:false});

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

//Connection post & get
app.get('/connexion',function (req,res){
    res.render('connexion');
});
app.post('/connexion',function(req,res){
    res.render('connected');    
});

//Inscription post & get
app.get('/inscription',function (req,res){
    res.render('inscription');
});
app.post('/inscription',function (req,res){
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