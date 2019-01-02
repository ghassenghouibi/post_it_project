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
        var t=prompt("Second :");
        var post_it = {
            id:(++id),
            type:'div',
            text:text,
            axeX : parseInt(text),
            axeY: parseInt(t),
            distance: 0,
            angleX:0,
            couleur:randomColor()
        };
        //-250,200
        post_it.distance=calculdistance(post_it.axeX,post_it.axeY);
        //100 et 125 la moité de la taille de post-it
        var x=-convertoplanx(post_it.axeX+100);
        var y=convertoplany(post_it.axeY+125);
        console.log("Distance entre le point du mileu et le post-it  ",x,y,"Angle ",getAngleDeg(x,y));
        post_it.angleX=Math.abs(getAngleDeg(x,y));
        elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
        
        tableauderecuperation.push(createObject(id.toString(),post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX));
        console.log(tableauderecuperation);
        tableaudeposition=factoryposition(tableauderecuperation);
        console.log(tableaudeposition);
        decomposetabs(tableaudeposition,tabll,tabrr,tablb,tabrb);

        
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
        s.addEventListener("click",newDragAndDrop.clicked);
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

function target(e){
    

   
    //TODO collision quand on bouge l'element
    if(e.clientX<window.innerWidth/2 && e.clientY < window.innerHeight/2){
       // console.log("==>",convertoplanx(e.clientX),convertoplany(e.clientY));
       // console.log("client Angle ->",getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY)));        
       // console.log("LL");
        for(var ii=0;ii<tabll.length;ii++){
            if(Math.round(tabll[ii].degree)==Math.round( getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY))) ){
                console.log("LL ANGLE WOOOOOOOOOOOOOOUUUUUUUUUUUUUUUUUUUUHHHHHHHHHHHHOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                //TODO bouger !!
            }
        }
    }
    else if(e.clientX<window.innerWidth/2 && e.clientY > window.innerHeight/2){
        //console.log(direction(convertoplanx(e.clientX),convertoplany(e.clientY)));
      //  console.log("client Angle ->",getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY)));        
      //  console.log("LB");
    }
    else if(e.clientX>window.innerWidth/2 && e.clientY>window.innerHeight/2){
        //console.log(direction(convertoplanx(e.clientX),convertoplany(e.clientY)));
        console.log("client Angle ->",getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY)));        
        console.log("RB");
    }
    else{
        //console.log(direction(convertoplanx(e.clientX),convertoplany(e.clientY)));
        console.log("client Angle ->",getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY)));     
        console.log("RR");
        
     //console.log("degree ",mouseangle(axeX,axeY));      
    }
}
function main (){
    recupererDuServeur();
    var supprimer=new BS("Supprimer","btn btn-danger","glyphicon glyphicon-trash",0,undefined,undefined,0);
    var ajouter=new BA("Ajouter","btn btn-success","glyphicon glyphicon-plus-sign",undefined,0,undefined,0);
    var deconnexion=new BD("Ajouter","btn btn-warning","glyphicon glyphicon-log-out",undefined,0,0,undefined);

    centre();
    boucleDeselectionDePostit();
    

    window.addEventListener("mousemove",target);

}