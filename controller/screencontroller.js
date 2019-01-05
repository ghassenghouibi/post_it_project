window.onload=main;
//nombre de tentative de connexion effectuer
var nombredetentative=0;
/** Class Vue
 * @debrif cette classe permet les changement de vues  
 */
class Vue{
    
    constructor(){}
    /** controlToken ()
    * @method controleToken 
    * @debrif Cette méthode vérifie si le client à un token 
    * si ou elle va le rediriger vers la page de home peut importe sa rêquete
    * 
    */
    controleToken(){
        if (localStorage.getItem("token") != null && window.location!="/home") window.location="/home";
    }
    /** changerLaVue()
     * @method changerLaVue
     * @debrif Cette méthode permet de changer la vu entre deux champs
     */
    changerLaVue(){
        let element=document.getElementById('champdeconnexion');
        let tentative=document.getElementById('tentative');
        element.style.display="none";
        tentative.style.display="block";
    }

}
/** fonction connexionUtilisateur(event,email,password)
 * @debrif cette fonction permet de faire une rêquete au serveur pour la connexion si tous se passe bien on aura un token sinon l'element danger s'affiche 
 * au bout de la troisème tentative la fonction change la vue vers mot de passe oublié
 * @param event event 
 * @param email email de l'utilisateur
 * @param password mot de passe de l'utilisateur
 */
function connexionUtilisateur(event,email,password) {		
        event.preventDefault();
        var form=document.getElementById('formconnexion');
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/connexion', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                if(JSON.parse(xhr.response)!="Email ou mot de passe incorrect"){
                    localStorage.setItem('token', xhr.response);
                    sessionStorage.setItem('clicked','yes');
                    window.location.href="/home";
                }
                else{
                    nombredetentative++;
                    let danger=document.getElementById("danger");
                    danger.style.display="block";
                    form.reset();
                    if(nombredetentative==3){
                        let event=new Vue();
                        event.changerLaVue();
                    }
                }
            }
        }				
        var email = document.getElementById('inputEmail').value;
        var password = document.getElementById('inputPassword').value;
        var payLoad = "email=" + email + "&" + "motdepasse=" + password; 
        xhr.send(payLoad); 				
}
/** Fonction main()
*  @debrif cette fonction sera exécuter à l'événement window.load
*/
function main(){

    let event=new Vue();
    event.controleToken();
    let direction=document.getElementById('motdepasseclick');
    if(direction) direction.addEventListener('click',event.changerLaVue);
    var form=document.getElementById('formconnexion');
    if(form) form.addEventListener('submit',connexionUtilisateur);
    

}

