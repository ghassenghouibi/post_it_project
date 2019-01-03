window.onload=main;

function addListeners(element,evenement,fonction){

    element.addEventListener(evenement, fonction);

}
class Events{
    
    constructor(){}
    controletoken(){
        //TODO vérification de la signature du token
        if (localStorage.getItem("token") != null && window.location!="/home") window.location="/home";
    }
  

}

function main(){
    //Token
    let controle=new Events();
    controle.controletoken();
}


