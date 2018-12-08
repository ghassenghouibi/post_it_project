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
    /*Fonction ajouterUnUtilisateurDansLaBaseDeDonnes(nom,prenom,email,motdepasse,done)
    *brief cette fonction permet l'ajout d'un nouveau utilisateur dans la base de données à condition qu'il a pas déjà un compte 
    *param nom le nom renseigner de l'utilisateur
    *param prenom le prenom renseigner par l'utilisateur
    *param email l'email de l'utilisateur et ce dernier il peut pas exister 2 fois
    *param done retourne 0 si le compte existe et 1 si le compte n'existe pas et il sera bien ajouté 
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
    /* fonction chercherLutilisateurDansLabaseDeDonnees(email,motdepasse,done)
    *brief cette fonction permet de rechercher si un utilisateur exsiste ou pas dans la basse de données
    *param email l'email de l'utilisateur
    *param motdepasse le mot de passe de l'utilisateur
    *param done retourner la valeur dans la variable done
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
    //TODO fonction ajouterLePostitAlaBaseDeDonnees



}
module.exports=Database;