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

    constructor(){}
    
    /** Fonction ajouterUnUtilisateurDansLaBaseDeDonnes(nom,prenom,email,motdepasse,done)
    * @debrif cette fonction permet l'ajout d'un nouveau utilisateur dans la base de données à condition qu'il a pas déjà un compte 
    * @param nom le nom renseigner de l'utilisateur
    * @param prenom le prenom renseigner par l'utilisateur
    * @param email l'email de l'utilisateur et ce dernier il peut pas exister 2 fois
    * @param done retourne 0 si le compte existe et 1 si le compte n'existe pas et il sera bien ajouté 
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
    * @param email l'email de l'utilisateur
    * @param motdepasse  le nouveau mot de passe
    */
    mettreAjourLecompteUtilisateur(email,motdepasse){
        let encrpytpassword=bcrypt.hashSync(motdepasse, null, null);
        var update="UPDATE utilisateur SET motdepasse=? WHERE email=?";
        connection.query(update,[encrpytpassword,email],function(err){
            if(err) throw err;
        });
    }
    
    /** ajouterAlaBaseDeDonnees(idUtilisateur,idPostit,coordonneesX,coordonneesY,distance,angleX,text,couleur,done)
    * @debrif cette fonction permet d'ajouter un post-it à jour la table 
    * @param idUtilisateur l'id de l'utilisateur
    * @param idPostit l'id de post-it
    * @param coordonneesX coordonnees sur l'axe X
    * @param coordonneesY coordonnees sur l'axe Y
    * @param distance distance entre le post-it et l'origine
    * @param angleX l'angle par rapport à l'origine
    * @param text le text de post-it
    * @param couleur la couleur de post-it
    * @param done le paramètre de récupération
    */
    ajouterAlaBaseDeDonnees(idUtilisateur,idPostit,coordonneesX,coordonneesY,distance,angleX,text,couleur,done){
        var insertQuery="INSERT INTO post_it (iduser,idPostit,coordonneesX,coordonneesY,distance,angleX,text,couleur) values (?,?,?,?,?,?,?,?)";
                connection.query(insertQuery, [idUtilisateur,idPostit,coordonneesX,coordonneesY,distance,angleX,text,couleur],function(err){
                    if (err) throw err;
                    else done(1);
        });
        
    }
    /**  fonction chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done)
    * @debrif cette fonction permet de rechercher si un utilisateur exsiste ou pas dans la basse de données
    * @param email l'email de l'utilisateur
    * @param motdepasse le mot de passe de l'utilisateur
    * @param done le paramètre de récupération
    */
    chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done){
        connection.query("SELECT * FROM utilisateur WHERE email=?",[email] ,function (err, rows) {
            if (err) throw err;            
            else if(rows.length==0) done(0);
            if(!bcrypt.compareSync(motdepasse, rows[0].motdepasse)) done(0);
            else done(1);
        });
    }
    /** fonction chercherLidDeLutilisateur(email,done)
     * @debrif cette fonction renvoie l'id de l'utilisateur
     * @param email qui permet la requete a identifier l'utilisateur grace a son mail
     * @param done le paramètre de récupération
     */
    chercherLidDeLutilisateur(email,done){
        var search="SELECT id FROM utilisateur WHERE email=?";
        connection.query(search,[email] ,function (err, rows) { 
            if (err) throw err;  
            if(rows[0]) done(rows[0].id);
            else done(0);
        });
    }
    /** fonction SupprimerUnPostIt(idUtilisateur,idPostit,done)
    * @derbrif cette fonction permet de supprimer un post-it de la base de données
    * @param idUtilisateur l'id de l'utilisateur
    * @param idPostit  l'id de post-it
    * @param done le paramètre ou on vas récupérer la valeur
    */
    SupprimerUnPostIt(idUtilisateur,idPostit,done){
        var supp ="DELETE FROM post_it WHERE iduser=? and idPostit=? ";
        connection.query(supp, [idUtilisateur,idPostit],function(err,rows){
            if (err) throw err;
            else done(1);
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
                        id:rows[i].idPostit,
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

    /** fonction mettreAjourText(idUtilisateur,idPostit,text,done)
    * @debrif cette fonction permet de modifier le text d'un post-it
    * @param idUtilisateur l'id de l'utilisateur
    * @param idPostit l'id de Postit
    * @param text le nouveau text
    * @param done le paramètre de récupération 
    */
    mettreAjourText(idUtilisateur,idPostit,text,done){
        var update="UPDATE post_it SET text=? WHERE iduser=? AND idPostit=?";
        connection.query(update,[text,idUtilisateur,idPostit],function(err){
            if (err) throw err;
            else done(1);
        });
    }
    /** fonction nombredePostit(idUtilisateur,done)
     * @debrif cette fonction permet de récuperer le nombre de post-it de l'utilisateur
     * @param idUtilisateur l'id de l'utilisateur
     * @param done le paramètre de récupération
     */
    nombredePostit(idUtilisateur,done){
        var search="SELECT * FROM post_it WHERE idPostit = (SELECT MAX(idPostit) FROM post_it) AND iduser=?";
        connection.query(search,[idUtilisateur],function(err,rows){
            if(err) throw err;
            if(!rows[0]) done(0);
            else done(rows[0].idPostit);
            
        });
    }
}
module.exports=Database;