window.onload = main;

var id=0;
var tabx=new Array();
var taby=new Array();
var tableauderecuperation=new Array();
var tableaudeposition=new Array();
var tabrr=new Array();
var tabll=new Array();
var tablb=new Array();
var tabrb=new Array();

/** Class controller qui va gérer tous les différentes actions du post-it
 * l'ajout d'un nouveau post-it par exemple
 * la suppression de post-it
 * 
 */
class Postit{
    constructor(){
        //A récupérer à partir de la base de données
        //id
        //tabx taby
     
    }
    /** Fonction qui permet d'ajouter un nouveau post it 
     *  @debrif la fonction utilise des positions random et une couleur random aussi
     */
    ajoutPostit(){
        var text=prompt('Ecrivez le Text de post it S\'il vous plait'); 
        console.log("Add a new Post it");
        var post_it = {
            id:(++id),
            type:'div',
            text:"text",
            axeX : 0,
            axeY: 0,
            distance:0,
            angleX:0,
            couleur:randomColor()
        };
        post_it.distance=calculdistance(post_it.axeX,post_it.axeY);

        console.log("xplan-> ",window.innerWidth/2,"yplan",window.innerHeight/2);
        console.log("x-> ",convertoplanx(post_it.axeX),"y->",convertoplany(post_it.axeY));
        let ps=produitscalaire(convertoplanx(post_it.axeX),convertoplany(post_it.axeY),window.innerWidth/2,window.innerHeight/2);
        console.log("le produit scalaire -> ",ps);
        let tt1=longeurduvecteur(convertoplany(post_it.axeX),convertoplany(post_it.axeY));
        let tt2=longeurduvecteur(window.innerWidth/2,window.innerHeight/2);
        console.log("-> ",tt1*tt2);
        console.log("calcul angle -> ",calcAngle(ps/(tt1*tt2)));
        //post_it.angleX=mouseangle(post_it.distance,window.innerHeight/2);
        console.log(post_it);

        elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,convertoplany(post_it.axeY),post_it.couleur);
        //tableauderecuperation.push(createObject(id.toString(),post_it.axeX,convertoplany(post_it.axeY)+250,calculdistance(post_it.axeX,convertoplany(post_it.axeY)),mouseangle(convertoplanx(post_it.axeX),convertoplany(convertoplany(post_it.axeY)))));
        //console.log(tableauderecuperation);
        //tableaudeposition=factoryposition(tableauderecuperation);
        //console.log(tableaudeposition);
        //decomposetabs(tableaudeposition,tabll,tabrr,tablb,tabrb);
    }
    
    
    
}

function longeurduvecteur(x,y){
    return Math.sqrt( (Math.pow(x,2)) + (Math.pow(y,2)));
}
function produitscalaire(x1,y1,x2,y2){
    return (x1*x2)+(y1*y2);
}
function calcAngle(ps, hypotenuse) {
    return Math.acos(ps / hypotenuse);
}
/** Fonction Boucle de selection de post it
 *  @debrif cette fonction permet de selectionner les post it vu qu'on a des nouveaux elements qu'ajoutent à chaque fois
 * 
 */
function boucleDeselectionDePostit(){
    var select=document.querySelectorAll('.fill');
    var newDragAndDrop=new DragAndDrop();
    for(const s of select){
        s.addEventListener("dragstart",newDragAndDrop.dragStart);
        s.addEventListener("dragend",newDragAndDrop.dragEnd);
    }
    requestAnimationFrame(boucleDeselectionDePostit);
}

/** Fonction recupererDuServeur()
     * @debrif cette fonction permet de récuperer les post it déjà présent dans la base de données
     * 
     */
function recupererDuServeur() {		
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/home.information', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var values = xhr.response;
            console.log("xhr",xhr.response);
            let obj = JSON.parse(values);
            for(let i=0;i<obj.length;i++){
                chargerPostit(obj[i].coordonneesX,obj[i].coordonneesY,obj[i].text,obj[i].couleur);
            }            
        }
    }
    xhr.send(null); 				
}
function chargerPostit(coordoneesX,coordoneesY,text,couleur){
    var post_it = {
        id:(++id),
        type:'div',
        text:text,
        axeX : coordoneesX,
        axeY: coordoneesY,
        couleur:couleur
        
    };
    elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
}    

function main (){
    recupererDuServeur();
    var supprimer=new BS("Supprimer","btn btn-danger","glyphicon glyphicon-trash",0,undefined,undefined,0);
    var ajouter=new BA("Ajouter","btn btn-success","glyphicon glyphicon-plus-sign",undefined,0,undefined,0);
    var deconnexion=new BD("Ajouter","btn btn-warning","glyphicon glyphicon-log-out",undefined,0,0,undefined);

    centre();
    boucleDeselectionDePostit();


    //window.addEventListener("mousemove",target);

}