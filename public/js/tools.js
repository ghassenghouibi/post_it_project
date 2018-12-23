/**fonction getRandomInInclusive(min,max)
/* brief fonction qui permet de retouner une valeur compris entre min et max y compris
* @param min valeur min
* @param max valeur max
* @return une valeur comprise entre les valeurs min et max
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}


/** fonction randomColor
 * brief permet de générer une couleur aléatoire
 * @return la couleur
 */
function randomColor(){
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}


/** fonction elementFactory(text,attach,x,y,color)
*brief la création des elements  
* @param type le type d'element a créer
* @param text le text a inserer
* @param x coordonnées sur l'axe x
* @param y coordonnées sur l'axe y
* @param color la couleur
* @return un element 
*/
function elementFactory(id,type,text,x,y,color){
    var element=document.createElement(type);
    document.body.appendChild(element);
    element.innerHTML=text;
    element.id=id;
    element.className="fill"
    element.draggable="true";
    element.style.cursor='move';
    element.style.textAlign='center';
    element.style.font='x-large arial, sans-serif';
    element.style.wordWrap='break-word';
    element.style.position='relative';
    element.style.WebkitBorderBottomRightRadius="500px 20px";
    element.style.BoxShadow='10px 10px 5px #656565';
    element.style.left=x+"px";
    element.style.top=y+"px";
    element.style.width=200+"px";
    element.style.height=250+"px";
    element.style.backgroundColor=color;

    return element;
}



