window.onload = main;
var id=0;
/* fonction elementFactory(text,attach,x,y,color)
*brief la création des elements  
*param type le type d'element a créer
*param text le text a inserer
*param x coordonnées sur l'axe x
*param y coordonnées sur l'axe y
*param color la couleur
*return un element 
*/
function elementFactory(id,type,text,x,y,color){
    var element=document.createElement(type);
    document.body.appendChild(element);
    element.innerHTML=text;
    element.id=id;
    element.style.cursor='move';
    element.style.textAlign='center';
    element.style.font='x-large arial, sans-serif';
    element.style.wordWrap='break-word';
    element.style.position='absolute';
    element.style.WebkitBorderBottomRightRadius="500px 20px";
    element.style.BoxShadow='10px 10px 5px #656565';
    element.style.left=x+"px";
    element.style.top=y+"px";
    element.style.width=200+"px";
    element.style.height=250+"px";
    element.style.backgroundColor=color;

    return element;
}

/*fonction getRandomInInclusive(min,max)
/* brief fonction qui permet de retouner une valeur compris entre min et max y compris
*param min valeur min
*param max valeur max
*return une valeur comprise entre les valeurs min et max
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

/** fonction randomColor
 * brief permet de générer une couleur aléatoire
 * return la couleur
 */
function randomColor(){
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}

/*fonction saisieDepostIt()
* brief fonction destinée a la création de post it
*return element ajouté
*/
  
function saisieDepostIt(){
    var text=prompt('Ecrivez le Text de post it S\'il vous plait'); 
    let x=getRandomIntInclusive(0,1500);
    let y=getRandomIntInclusive(0,1000);
    let color=randomColor();
    id++;
    element=elementFactory(id,'div',text,x,y,color);

}
/* fonction sourisEvenement(event)
*brief capture la position de la souris sur les deux axes x et y a un evenement précis et les affiches à la console
*event l'evenement à préciser
*/
function sourisEvenement(event)
{
    var x = event.clientX;
    var y = event.clientY;
    console.log(x,y);
}
/* frameloop ()
*brief fonction permet rafraîchir la fonction sourisEvenement
*/
function frameloop(){
    window.requestAnimationFrame(frameloop);
    sourisEvenement(event);
}

function deconnexion(){
    window.location = "/";
}
//TODO ALGORITHME DE CHEVAUCHEMENT

/*fonction main
*brief la fonction principale
*/
function main (){
    var buttonAjouter=document.getElementById('Ajouter');
    buttonAjouter.addEventListener("click",saisieDepostIt);
    var buttonDeconnexion=document.getElementById('Deconnexion');
    buttonDeconnexion.addEventListener("click",deconnexion);
   
}