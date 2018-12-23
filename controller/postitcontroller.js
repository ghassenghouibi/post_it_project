"use strict"
window.onload = main;

var id=0;
var tabx=new Array();
var taby=new Array();

 /** fonction verifierLacollision
 * @debrif elle permet de vérifier s'il aura une collision ou pas sur des éléments déjà existant 
 * @param x la position sur l'axe des x 
 * @param y la position sur l'axe des y
 * @param tabx les positions déjà occupée par des post-it qui existe sur l'axe des x
 * @param taby  les position déjà occupée par des post-it qui existe sur l'axe des y
 */
function verifierLacollision(x,y,tabx,taby){
    console.log(x,y,tabx,taby);
    for(let i=0;i<tabx.length;i++){
        if (tabx[i] < x +200 && tabx[i] + 200 > x && taby[i] < y + 250 && taby[i] +250 > y) {
            console.log("No");
            return 0;
        }
    }
    console.log("Yes");
    return 1;
}

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
     *  @derif la fonction utilise des positions random et une couleur random aussi
     */
    ajoutPostit(){
        var text=prompt('Ecrivez le Text de post it S\'il vous plait'); 
        console.log("Add a new Post it");
        var post_it = {
            id:id,
            type:'div',
            text:text,
            axeX : 0,
            axeY: 0,
            couleur:randomColor()
        };
        do{
            post_it.axeX=getRandomIntInclusive(0,1200);
            post_it.axeY=getRandomIntInclusive(0,600);
            console.log("Position ", post_it.axeX, post_it.axeY);

        }while(!(verifierLacollision(post_it.axeX,post_it.axeY,tabx,taby)));
        tabx.push(post_it.axeX);
        taby.push(post_it.axeY);
        elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
        
        for(let count=0;count<tabx.length;count++){
            console.log("[",tabx[count],taby[count],"]");
        }
        id++;
    }

}





//tableau save de l'id de post-it
var save=new Array();
/** fonction dragStart()
 * @debrif quand l'evenement dragstart se déclenche cette fonction permet de récuperer l'id du post-it et rendre le post-it en question invisible
 */
function dragStart(){
    console.log("start");
    save.push(this.id);
    console.log(this.id);
    this.className += ' hold';
    setTimeout(()=> (this.className ='invisible'),0);
}
/** fonction dragEnd()
 * @debrif quand l'evenement dragEnd se déclenche cette fonction permet d'attribuer l'element a fill qui sont les post-it
 */
function dragEnd(){
    console.log("end");
    this.className= 'fill';

}
/** fonction dragOver()
 * @debrif quand l'evenement dragover se déclenche c'est à dira quand notre l'element séléctionner et sur la corbeille on affiche un message de suppression   
 */
function dragOver(e) {
    console.log("over");
    var alerted = localStorage.getItem('alerted') || '';
    if (alerted != 'yes') {
     alert("Element Will be Deleted !");
     localStorage.setItem('alerted','yes');
    }
    e.preventDefault();
}
/**fonction dragEnter()
 * @debrif quand l'evenement dragenter se déclenche cette fonction attribue le post-it à la classe hovered
 */
function dragEnter(e) {
    e.preventDefault();
    console.log("Enter");
    this.className += ' hovered';
}
/** fonction dragLeave()
 *  @debrif cette fonction permet juste de faire un signal quand on sors de la zone de suppression
 */
function dragLeave() {
    console.log("leave");
}
/** fonction dragDrop()
 * @debrif quand l'evenement drop se déclenche cette fonction permet de supprimer le post-it grâce à l'id dans le tableau save
 */
function dragDrop() {
    console.log("dropped");
    let element=document.getElementById(save[0]);
    document.body.removeChild(element);
    console.log(element);
    save.pop();
    localStorage.removeItem('alerted');
}
/** fonction deconnexion()
 * @debrif cette fonction permet la redirection vers la page d'acceuil et effacer le token du localstorage
 */
function deconnexion(){
    window.location = "/";
    localStorage.removeItem('token');

}
/** Fonction Boucle de selection de post it
 *  @debrif cette fonction permet de selectionner les post it vu qu'on a des nouveaux elements qu'ajoutent à chaque fois
 * 
 */
function boucleDeselectionDePostit(){
    var select=document.querySelectorAll('.fill');
    for(const s of select){
        s.addEventListener("dragstart",dragStart);
        s.addEventListener("dragend",dragEnd);

    }
    requestAnimationFrame(boucleDeselectionDePostit);
}
function main (){

    var newPost_it=new Postit();
    //var element=elementFactory(1,'div',"Hello you can add post-it and also you can drop it into the trash",innerWidth/2,innerHeight/2,"red");

    var buttonAjouter=document.getElementById('Ajouter');
    buttonAjouter.addEventListener("click",newPost_it.ajoutPostit);
    var buttonDeconnexion=document.getElementById('Deconnexion');
    buttonDeconnexion.addEventListener("click",deconnexion);
    boucleDeselectionDePostit();
    var buttonSupprimer=document.querySelector("#Supprimer");
    buttonSupprimer.addEventListener('dragover',dragOver);
    buttonSupprimer.addEventListener('dragenter',dragEnter);
    buttonSupprimer.addEventListener('dragleave',dragLeave);
    buttonSupprimer.addEventListener('drop',dragDrop);
    

}


