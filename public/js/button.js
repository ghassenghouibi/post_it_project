/** Class BS
 *  @debrif cette class créé le button supprimer grâce à la fonction ButtonFactory , et écoute les evenements (click,dragover,dragenter,dragleave,drop)
 */
class BS{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        var newDragAndDrop=new DragAndDrop();
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",newDragAndDrop.rappel);
        addListeners(this.element,"dragover",newDragAndDrop.dragOver);
        addListeners(this.element,"dragenter",newDragAndDrop.dragEnter);
        addListeners(this.element,"dragleave",newDragAndDrop.dragLeave);
        addListeners(this.element,"drop",newDragAndDrop.dragDrop);
    }
}
/** Class BA
 *  @debrif cette class créé le button Ajouter grâce à la fonction ButtonFactory , et écoute l'evenement click quand il sera déclencher 
 * on accède à la fonctionnalité ajout post-it
 */
class BA{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        var newPost_it=new Postit();
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",newPost_it.ajoutPostit);
    }
}
/** Class BD
 *  @debrif cette class créé le button deconnexion grâce à la fonction ButtonFactory , et écoute l'evenement click
 */
class BD{
    
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",deconnexion);
    }
}

/** fonction deconnexion() 
 * @debrif evenement se déclenche quand on click sur le button deconnexion on selectionne 
 * tous les post-it on les envoie au serveur aprés on change la vue et on supprime le token 
 */
function deconnexion(){
    selectionnerPostit();
    window.location = "/";
    localStorage.removeItem('token');
}


//TODO envoyer la distance et l'angle en fonction de la taille d'écran
/** fonction selectionnerPostit()
 *  @debrif  cette fonction permet de selectionner les post-it et envoyer au serveur element par element 
 */
function selectionnerPostit(){
    let element =document.querySelectorAll(".fill");
    if(element.length <1 ) console.log("VIDE");
    else{
        for(const s of element){
            envoyerAuServeur(extractleft(s),extracttop(s),0,0,(s.innerHTML),(s.style.backgroundColor));
        }
    }
}

/** fonction envoyerAuServeur(coordonneesX,coordonneesY,distance,angleX,text,couleur)
 * @debrif cette fonction fait une rêquete vers le serveur avec le header Authorization, et envoie les coordonnées de post-it
 * @param coordonneesX les coordonnées de post-it sur l'axe x
 * @param coordonneesY les coordonnées de post-it sur l'axe y
 * @param distance la distance entre l'origine et le post-it
 * @param angleX l'angle entre l'origine et le post-it
 * @param text le text du post-it
 * @param couleur la couleur du post-it
 */
function envoyerAuServeur(coordonneesX,coordonneesY,distance,angleX,text,couleur){
    
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/home.send",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status ==200){
            alert('xhr response ',xhr.response);
        }
    }  
    var payLoad ="coordonneesX="+coordonneesX+"&"+"coordonneesY="+coordonneesY+"&"+"distance="+distance+"&"+"angle="+angleX+"&"+"text="+text+"&"+"couleur="+couleur;    
    xhr.send(payLoad);
}