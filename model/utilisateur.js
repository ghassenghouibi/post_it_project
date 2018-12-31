var mysql= require('mysql');
const bcrypt=require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project_post_it'
  });
  
connection.connect();

/** Class Database 
* @brief permet le controle de la base de données et comporte des méthodes qui vont permettre de manipuler la base de données
*/
class Database{

    constructor(){ 
    }
    /** Fonction ajouterUnUtilisateurDansLaBaseDeDonnes(nom,prenom,email,motdepasse,done)
    *@debrif cette fonction permet l'ajout d'un nouveau utilisateur dans la base de données à condition qu'il a pas déjà un compte 
    *@param nom le nom renseigner de l'utilisateur
    *@param prenom le prenom renseigner par l'utilisateur
    *@param email l'email de l'utilisateur et ce dernier il peut pas exister 2 fois
    *@param done retourne 0 si le compte existe et 1 si le compte n'existe pas et il sera bien ajouté 
    */
    ajouterUnUtilisateurDansLaBaseDeDonnes(nom,prenom,email,motdepasse,done){
        var search="SELECT * FROM utilisateur WHERE email=?";
        connection.query(search,[email] ,function (err, rows){
            if (err) throw err;   
            if(rows[0]) done(0);
            else{
                var newUserMysql = {
                    nom :nom,
                    prenom:prenom,
                    email:email,
                    motdepasse: bcrypt.hashSync(motdepasse, null, null)
                };
                var insertQuery = "INSERT INTO utilisateur (nom,prenom,email,motdepasse) values (?,?,?,?)";
                connection.query(insertQuery, [newUserMysql.nom,newUserMysql.prenom, newUserMysql.email ,newUserMysql.motdepasse],function(err){
                    if (err) throw err;
                    done(1);
                });
            }
        });
    }
    /** Fonction mettreAjourLecompteUtilisateur 
     * @debrif cette fonction permet de mettre à jour le mot de passe de l'utilisateur quand ce dernier l'oublie
     * @param {*} email l'email de l'utilisateur
     * @param {*} motdepasse  le nouveau mot de passe
     */
    mettreAjourLecompteUtilisateur(email,motdepasse){
        let encrpytpassword=bcrypt.hashSync(motdepasse, null, null);
        var update="UPDATE utilisateur SET motdepasse=? WHERE email=?";
        connection.query(update,[encrpytpassword,email],function(err){
            if(err) throw err;
        });
    }
    
    /**  fonction chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done)
    * brief cette fonction permet de rechercher si un utilisateur exsiste ou pas dans la basse de données
    * @param email l'email de l'utilisateur
    * @param motdepasse le mot de passe de l'utilisateur
    * @param done retourner la valeur dans la variable done
    */
   chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done){
       
        connection.query("SELECT * FROM utilisateur WHERE email=?",[email] ,function (err, rows) {
            if (err) throw err;            
            else if(rows.length==0) done(0);
            if(!bcrypt.compareSync(motdepasse, rows[0].motdepasse)) done(0);
            else done(1);
        
        });
    }
    /** fonction chercherLidDeLutilisateur()
     * brief cette fonction renvoie l'id de l'utilisateur
     * @param email qui permet la requete a identifier l'utilisateur grace a son mail
     */
    chercherLidDeLutilisateur(email,done){
        var search="SELECT id FROM utilisateur WHERE email=?";
        connection.query(search,[email] ,function (err, rows) { 
            if (err) throw err;  
            if(rows[0]) done(rows[0].id);
            else done(0);
        });
    }
    /** fonction ajouterLePostitAlaBaseDeDonnees()
     *brief cette fonction permet d'ajouter les differents élément de post_it dans la base de données
     * @param idUtilisateur l'id de l'utilisteur recupérable a partir du token
     * @param coordonneesX le coordonées de post it par rapport à l'axe X
     * @param coordonneesY le coordonées de post it par rapport à l'axe Y
     * @param distance la distance de post it par rapport à l'origine
     * @param angleX l'angle de post_it par rapport à l'ogirine
     * @param tangente l'angle de post_it par rapport au radar (cercle du centre de l'origine)
     * @param text le text de post_it
     * @param couleur la couleur de post_it 
     * @param done où on va reçevoir la valeur
     */
    ajouterLePostitAlaBaseDeDonnees(idUtilisateur,coordonneesX,coordonneesY,distance,angleX,text,couleur,done){
        
        var insertQuery = "INSERT INTO post_it (iduser,coordonneesX,coordonneesY,distance,angleX,text,couleur) values (?,?,?,?,?,?,?)";
        connection.query(insertQuery, [idUtilisateur,coordonneesX,coordonneesY,distance,angleX,text,couleur],function(err){
            if (err) throw err;
            else done(1);
        });
    }
    /**
     * 
     * @param {*} idUtilisateur 
     * @param {*} coordonneesX 
     * @param {*} coordonneesY 
     * @param {*} done 
     */
    SupprimerUnPostIt(idUtilisateur,coordonneesX,coordonneesY,done){
        var supp ="DELETE FROM post_it WHERE iduser=? and coordonneesX=? and coordonneesY=?";
        connection.query(supp, [idUtilisateur,coordonneesX,coordonneesY],function(err,rows){
            if (err) throw err;
            if(rows[0]) done(1);
            else done(0);
        });
    }
    /**fonction chargerLesPostitDeLaBaseDeDonnees
     * @debrif cette fonction permet de renvoyer un tableau qui contient toutes les informations des post it
     * @param idUtilisateur l'id de l'utilisateur permet de se positionner et selectionner tous les post it de l'utilisateur
     * @param done renvoie le tableau de post it sinon 0 s'il y a pas
     */
    chargerLesPostitDeLaBaseDeDonnees(idUtilisateur,done){
        var search="SELECT * FROM post_it WHERE iduser=?";
        connection.query(search,[idUtilisateur] ,function (err, rows) {
            if (err) throw err;   
            if(rows[0]){
                let tableau=Array();
                for(let i=0;i<rows.length;i++){
                    var objet={
                        coordonneesX:rows[i].coordonneesX,
                        coordonneesY:rows[i].coordonneesY,
                        distance:rows[i].distance,
                        angleX:rows[i].angleX,
                        text:rows[i].text,
                        couleur:rows[i].couleur
                    };
                    tableau.push(objet)
                }
                done(tableau);
            }else{
                done(0);
            }
        });
    }
    mettreAjourLaBaseDeDonnees(idUtilisateur,coordonneesX,coordonneesY,distance,angleX,text,couleur,done){
        var search="SELECT * FROM post_it WHERE iduser=? AND coordonneesX=? AND coordonneesY=? AND distance=? AND angleX=? AND text=? AND couleur=?";
        connection.query(search, [idUtilisateur,coordonneesX,coordonneesY,distance,angleX,text,couleur],function(err,rows){
            if (err) throw err;
            if(rows[0]) done(0);
            else{
                var insertQuery="INSERT INTO post_it (iduser,coordonneesX,coordonneesY,distance,angleX,text,couleur) values (?,?,?,?,?,?,?)";
                connection.query(insertQuery, [idUtilisateur,coordonneesX,coordonneesY,distance,angleX,text,couleur],function(err){
                    if (err) throw err;
                    else done(1);
                });
            }
        });
    }
   

    /**fonction renvoyerLesCoordonnees
     * @param idPostit c'est l'id du post_it
     * @param done ou on va reçevoir le resultat de la rêquete
     */
    renvoyerLesCoordonnees(idPostit,done){
        var search="SELECT coordonneesX,coordonneesY FROM post_it WHERE id_post_it=?";
        connection.query(search,[idPostit] ,function (err, rows) {   
            if(err) throw err;
            if(rows[0]) done(rows[0].coordonneesX,rows[0].coordonneesY);
            else done(0); 
        });
    }
    /**fonction renvoyerLaCouleur
     * @param idPostit c'est l'id du post_it
     * @param done ou on va reçevoir le resultat de la rêquete 
     */
    renvoyerLaCouleur(idPostit,done){
        var search="SELECT couleur FROM post_it WHERE id_post_it=?";
        connection.query(search,[idPostit] ,function (err, rows) {   
            if(err) throw err;
            if(rows[0]) done(rows[0]);
            else done(0);
        });
    }
    /**fonction renvoyerLetext
     * @param idPostit c'est l'id du post_it
     * @param done ou on va reçevoir le resultat de la rêquete
     */
    renvoyerLeText(idPostit,done){
        var search="SELECT text FROM post_it WHERE id_post_it=?";
        connection.query(search,[idPostit] ,function (err, rows) {
            if (err) throw err;   
            if(rows[0]) done(rows[0]);
            else done(0);
            
        });
    }
    /**fonction renvoyerLaDistance
     * @param idPostit c'est l'id du post_it
     * @param done ou on va reçevoir le resultat de la rêquete
     */
    renvoyerLadistance(idPostit,done){
        var search="SELECT distance FROM post_it WHERE id_post_it=?";
        connection.query(search,[idPostit] ,function (err, rows) {   
            if(err) throw err;
            if(rows[0]) done(rows[0]);
            else done(0);
            
        });
    }

    /**fonction renvoyerLangle
     * @param idPostit c'est l'id du post_it
     * @param done ou on va reçevoir le resultat de la rêquete
     */
    renvoyerLangle(idPostit,done){
        var search="SELECT angleX FROM post_it WHERE id_post_it=?";
        connection.query(search,[idPostit] ,function (err, rows) {
            if (err) throw err;   
            if(rows[0]) done(rows[0]);
            else done(0);
            
        });
    }

}
module.exports=Database;