window.onload=main;


class Events{
    constructor(){}
    controletoken(){
        //TODO le temps entre la redirection et le chargement
        //TODO vérification de la signature du token
        if (localStorage.getItem("token") != null) window.location="/home";

    }
}

function main(){
    let controle=new Events();
    controle.controletoken();

    

}