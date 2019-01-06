/** Fonction pythagore(x,y)
* @debrif cette fonction permet de calculer le côte d'un triangle rectangle qui applique le théorme de pythagore
* @param x le côte x du triangle
* @param y le côte y du triangle
*/
function pythagore(x,y){
    return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}
/** Fonction creaObject(id,posx,posy,distance,degree)
* @debrif cette fonction permet de creer un objet à partir des informations suivantes
* @param id l'id 
* @param posx position sur l'axe x
* @param posy position sur l'axe y
* @param distance la distance par rapport à l'origine
* @param degree  le degree par rapport à l'origine
*/
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

/** Fonction mouseangle
* @debrif cette fonction renvoie l'angle de la souris par rapport à l'origine
* @param x position x 
* @param y position y
*/
function mouseangle(x,y){
   return getAngleDeg(Math.abs(x),Math.abs(y)); 
}

/** Fonction angleDegree
* @debrif cette fonction nous renvoie l'angle entre deux segment
* @param x valeur de cote x 
* @param y valeur de cote y
*/
function getAngleDeg(x,y) {
   var angleRad = Math.atan(y/x);
   var angleDeg = angleRad * 180 / Math.PI;
   
   return(angleDeg);
}

/** fonction convertoplanx
* @debrif cette fonction permet de convertir des coordonnées clientX en coordonnées d'un répère orthonomé
* @param y coordonnées sur l'axe x
*/
function convertoplanx(x){
   return Math.abs((x-window.innerWidth/2));
}
/** fonction convertoplany
* @debrif cette fonction permet de convertir des coordonnées clientY en coordonnées d'un répère orthonomé
* @param y coordonnées sur l'axe y
*/
function convertoplany(y){
   return Math.abs((y-window.innerHeight/2));
}
 
/** Fonction blob()
* @debrif Fonction de création d'un petit suiveur du curseur de la souris et quand il bouge pas il sert à se repèrer
* @param x coordonnées sur l'axe x
* @param y coordonnées sur l'axe y
* @param id l'id de l'element
*/
function blob(x,y,id){
   var carre = document.createElement("div");
   carre.style.backgroundColor="black";
   carre.style.width = 50 + "px";
   carre.style.height = 50 + "px";
   carre.style.left = x + "px";
   carre.style.borderRadius= "30px";
   carre.style.top = y + "px";
   carre.id=id;
   carre.style.position = "fixed";
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

/** fonction calculdistance(x,y)
* @debrif cette fonction permet de faire le calcul de la distance entre un point x et y et le centre de l'ecran
* @param x position sur l'axe x 
* @param y position sur l'axe y
*/
function calculdistance(x,y){
   return Math.sqrt(Math.pow((x-window.innerWidth/2),2)+Math.pow((y-window.innerHeight/2),2));
}

/** fonction extractleft(element)
* @debrif cette fonction permet de renvoyer la position left en int
* @param element l'element à extraire
*/
function extractleft(element){
   return parseInt((element.style.left.split("px"))[0]);
}

/** fonction extracttop(element)
* @debrif cette fonction permet de renvoyer la position top en int
* @param element l'element à extraire
*/
function extracttop(element){
   return parseInt((element.style.top.split("px"))[0]);
}

/** Fonction getdirection
* @debrif cette fonction permet de renvoyer la position sur un repère  rr signifie right right ll left left rb right bottom lb left bottom
* par rapport à l'origine 
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

/** fonction ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom)
* @debrif cette fonction permet de créér des buttons et ajouter des span dedans
* @param idbutton id de l'element
* @param classbutton  la classe du button
* @param classspan le span
* @param left position left
* @param right position right
* @param top  position top
* @param bottom position bottom
*/
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

/** fonction addListeners(element,evenement,fonction)
* @debrif cette fonction permet d'ecouter des évenements elle prend en paramètre l'element 
* et l'evenement ("mouseonmove","click",..etc) fonction à exécuter quand l'événement se déclenche
* @param element l'élément   
* @param evenement l'événement déclencher
* @param fonction  la fonction à exécuter
*/
function addListeners(element,evenement,fonction){

   element.addEventListener(evenement, fonction);

}
/** fonction elementFactory(text,attach,x,y,color)
* @debrif permet la création des elements (post-it en particuler) 
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
   if(x<0 || y <0 ||y > window.innerHeight-125 || x >window.innerWidth-100){
      console.log("->",x,y);
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

/** fonction getRandomInInclusive(min,max)
* @derief fonction qui retourne une valeur compris entre min et max y compris
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
* @debrif permet de générer une couleur aléatoire
* @return la couleur
*/
function randomColor(){
   return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}