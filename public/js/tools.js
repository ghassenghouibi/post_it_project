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
   element.style.position='absolute';
   if(x<0 || y <0 ||y > window.innerHeight-250 || x >window.innerWidth-200){
      element.style.display='none';
   }
   element.style.WebkitBorderBottomRightRadius="500px 20px";
   element.style.BoxShadow='10px 10px 5px #656565';
   element.style.left=x+"px";
   element.style.top=y+"px";
   element.style.width=200+"px";
   element.style.height=250+"px";
   element.style.backgroundColor=color;

   return element;
}

/** Fonction pythagore
 * @debrif cette fonction permet de calculer le côte d'un triangle rectangle qui applique le théorme de pythagore
 * @param x le côte x du triangle
 * @param y le côte y du triangle
 */
function pythagore(x,y){
    return Math.round(Math.sqrt(Math.pow(x,2)+Math.pow(y,2)));
 }
/** Fonction getdirection
 * @debrif cette fonction permet de renvoyer la position sur un repère  rr signifie right right ll left left rb right bottom lb left bottom
 * @param x la valeur du point x 
 * @param y la valeur du point y
 */ 
function getdirection(x,y){
    if(x>(window.innerWidth/2) && y<(window.innerHeight/2))
       return "rr";
    else if(x<(window.innerWidth/2) && y<(window.innerHeight/2))
       return "ll";
    else if(x>(window.innerWidth/2) && y>(window.innerHeight/2))
       return "rb";
    else
       return "lb";
 }
 
/** Fonction angleDegree
  * @debrif cette fonction nous renvoie l'angle (dans un triangle rectangle )
  * @param x valeur de cote x 
  * @param y valeur de cote y
  *   */
function getAngleDeg(x,y) {
   var angleRad = Math.atan(y/x);
   var angleDeg = angleRad * 180 / Math.PI;
   
   return(angleDeg);
}
 
 
function convertoplanx(x){
   return Math.abs((x-window.innerWidth/2));
}
function convertoplany(y){
   return Math.abs((y-window.innerHeight/2));
}
 
/** Fonction mouseangle
 * @debrif cette fonction renvoie l'angle de la souris par rapport à l'origine
 * @param x position x 
 * @param y position y
 */
function mouseangle(x,y){
    return getAngleDeg(Math.abs(x),Math.abs(y)); 
 }
function createObject(id,posx,posy,distance,degree){

   var objet={
      id:id,
      posx:posx,
      posy:posy,
      distance:distance,
      degree:degree,
      position:getdirection(posx,posy)
   };

   return objet; 
}

/** Fonction centre()
 * @debrif Fonction de création d'un petit point noir au milieu de l'ecran pour mieux se reperer
 */
function centre(){
   var carre = document.createElement("div");
   carre.style.backgroundColor="black";
   carre.style.width = 10 + "px";
   carre.style.height = 10 + "px";
   carre.style.left = window.innerWidth/2 -5 + "px";
   carre.style.borderRadius= "60px";
   carre.style.top = window.innerHeight/2 -5 + "px";
   carre.id="centre";
   carre.style.position = "absolute";
   document.body.appendChild(carre);
   return carre;
}

/** fonction verifierLacollision
* @debrif elle permet de vérifier s'il aura une collision ou pas sur des éléments déjà existant 
* @param x la position sur l'axe des x 
* @param y la position sur l'axe des y
* @param tab les positions déjà occupée par des post-it qui existe 
*/
function verifierLacollision(x,y,tab){
   for(let i=0;i<tab.length;i++){
       if (tab[i].posx < x +200 && tab[i].posx + 200 > x && tab[i].posy < y + 250 && tab[i].posy +250 > y) {
           return 0;
       }
   }
   return 1;
}

function calculdistance(x,y){
   return Math.sqrt(Math.pow((x-window.innerWidth/2),2)+Math.pow((y-window.innerHeight/2),2));
}


function extractleft(element){
   return parseInt((element.style.left.split("px"))[0]);
}
function extracttop(element){
   return parseInt((element.style.top.split("px"))[0]);
}



function ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom){
   var button=document.createElement("button");
   var span=document.createElement('span');
   span.className=classspan;
   document.body.appendChild(button);
   button.appendChild(span);
   button.id=idbutton;
   button.className=classbutton;
   button.style.borderRadius="50%";
   button.style.left=left+"px";
   button.style.right=right+"px";
   button.style.top=top+"px";
   button.style.bottom=bottom+"px";
   button.style.width=100+"px";
   button.style.height=100+"px";
   button.style.position="fixed";
 
   return button;
 
}


function addListeners(element,evenement,fonction){

   element.addEventListener(evenement, fonction);

}
