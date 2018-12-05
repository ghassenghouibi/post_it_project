var mysql= require('mysql');
const bcrypt=require('bcrypt-nodejs');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project_post_it'
  });
  
//window.localStorage.SetItem("token",value);
//getItem("token");
//sessionStorage
connection.connect();
class Database{

    constructor(){ 
    }
    
    addUserInDataBase(nom,prenom,email,motdepasse,done){
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

    findUserInDataBase(email,motdepasse,done){
        var newUserMysql = {
            email:email,
            motdepasse: bcrypt.hashSync(motdepasse, null, null)
        };

        connection.query("SELECT * FROM utilisateur WHERE email=?",[newUserMysql.email] ,function (error, rows) {

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


}
module.exports=Database;