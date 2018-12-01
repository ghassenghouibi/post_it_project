var mysql= require('mysql');
const bcrypt=require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project_post_it'
  });
   
connection.connect();
class Database{

    constructor(){ 
    }
    
    addUserInDataBase(nom,prenom,email,motdepasse){
        var search="SELECT * FROM utilisateur WHERE email=?";
        connection.query(search,[email] ,function (error, rows) {        
            if(rows[0]){
                console.log('The solution is: ', rows[0]);
                console.log('We cannot log you in ');
                return 0;
            }
            
            else{

                var newUserMysql = {
                    nom :nom,
                    prenom:prenom,
                    email:email,
                    motdepasse: bcrypt.hashSync(motdepasse, null, null)
                };

                var insertQuery = "INSERT INTO utilisateur (nom,prenom,email,motdepasse) values (?,?,?,?)";
                console.log(newUserMysql);
                connection.query(insertQuery, [newUserMysql.nom,newUserMysql.prenom, newUserMysql.email ,newUserMysql.motdepasse],function(err, rows){
                if (err) throw err;
                console.log("Added user");
                });
            }
        });
    }

    findUserInDataBase(email,motdepasse){
        var newUserMysql = {
            email:email,
            motdepasse: bcrypt.hashSync(motdepasse, null, null)
        };
        var search="SELECT * FROM utilisateur WHERE (email,motdepasse)=(?,?)";
        connection.query(search,[newUserMysql.email,newUserMysql.motdepasse] ,function (error, rows) {

            if (error) throw error;

           
            else{
               
                console.log('OH it\'s not you ');
                
            }
        
        });
    }


}
module.exports=Database;