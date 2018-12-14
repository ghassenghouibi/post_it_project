var mysql= require('mysql');
const bcrypt=require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project_post_it'
  });
  
connection.connect();

/*Class Database 
*brief permet le controle de la base de données et comporte des méthodes qui vont permettre de manipuler la base de données
*/
class Database{

    constructor(){ 
    }
    /** Fonction ajouterUnUtilisateurDansLaBaseDeDonnes(nom,prenom,email,motdepasse,done)
    *brief cette fonction permet l'ajout d'un nouveau utilisateur dans la base de données à condition qu'il a pas déjà un compte 
    *@param nom le nom renseigner de l'utilisateur
    *@param prenom le prenom renseigner par l'utilisateur
    *@param email l'email de l'utilisateur et ce dernier il peut pas exister 2 fois
    *@param done retourne 0 si le compte existe et 1 si le compte n'existe pas et il sera bien ajouté 
    */
    ajouterUnUtilisateurDansLaBaseDeDonnes(nom,prenom,email,motdepasse,done){
        var search="SELECT * FROM utilisateur WHERE email=?";
        connection.query(search,[email] ,function (err, rows) {   
            if(rows[0]){
                console.log('The solution is:', rows[0]);
                console.log('We cannot log you in');
                done(0);
            }
            
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
    /**  fonction chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done)
    * brief cette fonction permet de rechercher si un utilisateur exsiste ou pas dans la basse de données
    * @param email l'email de l'utilisateur
    * @param motdepasse le mot de passe de l'utilisateur
    * @param done retourner la valeur dans la variable done
    */
   chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done){
       
        connection.query("SELECT * FROM utilisateur WHERE email=?",[email] ,function (error, rows) {

            if (error) throw error;
            
            else if(rows.length==0){
                console.log("IDK YOU");
                done(0);
            }
            if(!bcrypt.compareSync(motdepasse, rows[0].motdepasse)){
                done(0);            
                console.log('OH it s not you');
                
            }
            else{
                done(1);
                console.log('good it\'s you again');
            }
        
        });
    }
    /** fonction chercherLidDeLutilisateur()
     * brief cette fonction renvoie l'id de l'utilisateur
     * @param email qui permet la requete a identifier l'utilisateur grace a son mail
     */
    chercherLidDeLutilisateur(email,done){
        var search="SELECT id FROM utilisateur WHERE email=?";
        connection.query(search,[email] ,function (err, rows) {   
            if(rows[0]){
                console.log('=>', rows[0].id);
                done(rows[0].id);
            }
            
            else{
                done(0);
            }
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
    ajouterLePostitAlaBaseDeDonnees(idUtilisateur,coordonneesX,coordonneesY,distance,angleX,tangente,text,couleur,done){

        var insertQuery = "INSERT INTO post_it (id,coordonnees_x,coordonneees_y,distance,angleX,tangente,text,couleur) values (?,?,?,?,?,?,?,?)";

        connection.query(insertQuery, [idUtilisateur,coordonneesX,coordonneesY,distance,angleX,tangente,text,couleur],function(err){
            if (err) throw err;
            else{
                console.log("Post_it Ajouté");
                done(1);
            }
        });
    
    }
    /**fonction chargerLesPostitDeLaBaseDeDonnees
     * 
     */



}
module.exports=Database;