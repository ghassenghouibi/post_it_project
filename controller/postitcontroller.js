window.onload = main;
/*----------------------------------------------------------------Variables-Globales------------------------------------------------------------------------------------------*/
var id=recupererNbPostit();
var catchId=new Array();
var tableaudepostit=new Array();
/*--------------------------------------------------------------Fonction-Principal--------------------------------------------------------------------------------------------*/
function main (){
    console.log("=============",window.innerWidth,window.innerHeight);
    console.log("=============",window.innerWidth/window.innerHeight);

    recupererPostItDuServeur();
    boucleDeselectionDePostit();
    var supprimer=new ButtonSupprimer("Supprimer","btn btn-danger","glyphicon glyphicon-trash",0,undefined,undefined,0);
    var ajouter=new ButtonAjouter("Ajouter","btn btn-success","glyphicon glyphicon-plus-sign",undefined,0,undefined,0);
    var deconnexion=new ButtonDeconnexion("Deconnexion","btn btn-warning","glyphicon glyphicon-log-out",undefined,0,0,undefined);
    var play=new ButtonPlay("Bouger","btn btn-info","glyphicon glyphicon-play-circle",0,0,undefined,undefined);
    tableaudepostit.push(createObject("S",0,window.innerHeight,0,0));
    tableaudepostit.push(createObject("A",window.innerWidth,window.innerHeight,0,0));
    tableaudepostit.push(createObject("D",window.innerWidth,0,0,0));
    tableaudepostit.push(createObject("B",0,0,0,0));
    blob(window.innerWidth/2 -25 ,window.innerHeight/2 -25,"blob");  
}
/*-----------------------------------------------------------------------Fonctions--------------------------------------------------------------------------------------------*/
/** fonction deconnexion() 
* @debrif evenement se déclenche quand on click sur le button deconnexion on selectionne 
* tous les post-it on les envoie au serveur aprés on change la vue et on supprime le token 
*/
function deconnexion(){
    window.location = "/";
    localStorage.removeItem('token');
}
/** fonction selectXById(tableaudepostit,id)
* @debrif cette fonction permet de selectionner les coordonnées x dans le tableau de post-it par l'id de l'element
* @param tableaudepostit le tableau de post-it
* @param id l'id de l'element
*/
function selectXById(tableaudepostit,id){
    for(let i = 0 ;i<tableaudepostit.length;i++){
        if(tableaudepostit[i].id==id){
            return tableaudepostit[i].posx;
        }
    }
}
/** fonction selectYById(tableaudepostit,id)
* @debrif cette fonction permet de selectionner les coordonnées y dans le tableau de post-it par l'id de l'element
* @param tableaudepostit le tableau de post-it
* @param id l'id de l'element
*/
function selectYById(tableaudepostit,id){
    for(let i = 0 ;i<tableaudepostit.length;i++){
        if(tableaudepostit[i].id==id){
            return tableaudepostit[i].posy;
        }
    }
}

/** Fonction Boucle de selection de post it
*  @debrif cette fonction permet de selectionner les post it vu qu'on a des nouveaux
*  elements qu'ajoutent à chaque fois
*/
function boucleDeselectionDePostit(){
    var select=document.querySelectorAll('.fill');
    var newDragAndDrop=new DragAndDrop();
    for(const s of select){
        s.addEventListener("dragstart",newDragAndDrop.dragStart);
        s.addEventListener("dragend",newDragAndDrop.dragEnd);
        s.addEventListener("click",newDragAndDrop.clicked);
    }
    window.requestAnimationFrame(boucleDeselectionDePostit);   
}
/** fonction verifierDepassement(element,x,y)
* @debrif cette fonction permet de detecter si le post-it a un dépasser l'écran pour le remetrre au coordonnées de début
* @param element l'element 
* @param x les coordonnées x 
* @param y les coordonées y
*/
function verifierDepassement(element){
    element.style.left=selectXById(tableaudepostit,element.id)+"px";
    element.style.top=selectYById(tableaudepostit,element.id)+"px";
    console.log("1=> ",element.style.left);
    console.log("2=> ",element.style.top);
}
/** fonction verifierApparition(element,x,y)
* @debrif cette fonction permet d'afficher l'element ou le cacher vu que l'element inserer en dehors de l'ecran ne sont pas visible
* @param element l'element
* @param x les coordonnées x
* @param y les coordonées y
*/
function verifierApparition(element,x,y){

    if( x>=0 && y>=0 && (x<window.innerWidth-100) && (y<window.innerHeight-125)){
        console.log('ON');
        element.style.display='block';

    }
    else {
        console.log('OFF');
        element.style.display='none';
    }
}
/** fonction deplacement(element,position)
* @debrif cette fonction permet le deplacement d'un element en fonction de sa position
* @param element l'element
* @param position la position de l'element
*/
function deplacement(element,position){
    let x=(extractleft(element));
    let y=(extracttop(element));
    //verifierApparition(element,x,y);
    //console.log("x , y ",x,y);
    switch(position){
        case "ll":
            element.style.left=(x+5)+"px";
            element.style.top=(y+5)+"px";
            break;
        case "lb":
            element.style.left=(x+5)+"px";
            element.style.top=(y-5)+"px";
            break;
        case "rr":
            element.style.left=(x-5)+"px";
            element.style.top=(y+5)+"px"; 
            break;
        case "rb":
            element.style.left=(x-5)+"px";
            element.style.top=(y-5)+"px";
            break;
        default:
            break;
    }
    //verifierDepassement(element);
    
}
/** fonction target(e)
* @debrif cette fonction permet de suivre les coordonnées de la souris de l'utilisateur dans l'écran 
* et si l'angle de la souris est -+ 5 celui de post-it par rapport au rèpère on bouge l'element
* @param e  l'evenement
*/
function target(e){
    let souris=document.getElementById('blob');
    souris.style.left=e.clientX+"px";
    souris.style.top=e.clientY+"px";
    //console.log("client Angle ->",getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY)));
    for(let i=4;i<tableaudepostit.length;i++){
        if(Math.round(getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY))) >= Math.round(tableaudepostit[i].degree) -5 || Math.round(tableaudepostit[i].degree) +5   <= Math.round(getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY))) ){
            if(tableaudepostit[i].position == getdirection(e.clientX,e.clientY)){
                let element=document.getElementById(tableaudepostit[i].id);
                switch(tableaudepostit[i].position){
                    case "ll":
                        deplacement(element,"ll");
                        break;
                    case "rr":
                        deplacement(element,"rr");
                        break;
                    case "lb":
                        deplacement(element,"lb");
                        break;
                    case "rb":
                        deplacement(element,"rb");
                        break;
                    default:
                        break;
                    }
                    
                }
            }
        }
}
/** fonction play(e)
* @debrif cette fonction permet d'excuter l'evenement target ou pas ça dépend du click qui est lier au button play
* @param e l'evenement 
*/
function play(e){
    e.stopImmediatePropagation();    
    var clicked = sessionStorage.getItem('clicked');
    if(clicked == 'yes') sessionStorage.setItem('clicked','no');
    else  sessionStorage.setItem('clicked','yes');
    
    if (clicked == 'yes') {
        alert(`Play On vous avez ${tableaudepostit.length-4} post-it`);
        window.addEventListener("mousemove",target);
    }
    else{
        alert("Play OFF");
        let souris=document.getElementById('blob');
        souris.style.left=window.innerWidth/2 -25+"px";
        souris.style.top=window.innerHeight/2 -25+"px";
        window.removeEventListener("mousemove",target);
    }
}



/*-------------------------------------------------------------------------Class----------------------------------------------------------------------------------------------*/

/** Class Post-it prendra en charge la création de l'ajout d'un post-it  
* @methods ajouterPostit permet l'ajout d'un nouveau post-it 
*/
class Postit{
    constructor(){}
    ajouterPostit(){
        var text=prompt('Ecrivez le Text de post it S\'il vous plait'); 
        var post_it = {
            id:(++id),
            type:'div',
            text:text,
            axeX : getRandomIntInclusive(0,window.innerWidth-250),
            axeY: getRandomIntInclusive(0,window.innerHeight-200),
            distance: 0,
            angleX:0,
            couleur:randomColor()
        };
       
        
        while(verifierLacollision(post_it.axeX,post_it.axeY,tableaudepostit)!=1){
            if(tableaudepostit.length>15){
                post_it.axeX=getRandomIntInclusive((-window.innerWidth)*1.5,window.innerWidth*1.5);
                post_it.axeY=getRandomIntInclusive((-window.innerHeight)*1.5,window.innerHeight*1.5);
            }
            else{
                post_it.axeX=getRandomIntInclusive(0,window.innerWidth);
                post_it.axeY=getRandomIntInclusive(0,window.innerHeight);
            }
        }
        post_it.distance=calculdistance(post_it.axeX,post_it.axeY);
        //milieu de post-it
        var addx,addy;
        if(post_it.axeX> window.innerWidth/2 ) addx=-100;
        else addx=+100;
        if(post_it.axeY> window.innerHeight/2 ) addy=-125;
        else addy=+125;
        
        var x=convertoplanx(post_it.axeX+addx);
        var y=convertoplany(post_it.axeY+addy);        
        post_it.angleX=Math.abs(getAngleDeg(x,y));
        elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
        tableaudepostit.push(createObject(id.toString(),post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX));
        envoyerPostItAuServeur(post_it.id,post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX,post_it.text,post_it.couleur);

    }
    
}
/** Class ButtonAjouter
*  @debrif cette class créé le button Ajouter grâce à la fonction ButtonFactory , et écoute l'evenement click quand il sera déclencher 
* on accède à la fonctionnalité ajout post-it
*/
class ButtonAjouter{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        var newPost_it=new Postit();
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",newPost_it.ajouterPostit);
    }
}
/** Class ButtonDeconnexion
*  @debrif cette class créé le button deconnexion grâce à la fonction ButtonFactory , et écoute l'evenement click
*/
class ButtonDeconnexion{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",deconnexion);
    }
}

/** Class ButtonPlay
* @debrif cette class créé le button play qui permet d'écouter l'evenement click qui va être utile pour faire bouger les post-it ou pas
*/
class ButtonPlay {
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",play);
    }
}

/** Class ButtonSupprimer
* @debrif cette class créé le button supprimer grâce à la fonction ButtonFactory , et écoute les evenements (click,dragover,dragenter,dragleave,drop)
*/
class ButtonSupprimer{
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
/** Class Drag And Drop
*  @derif cette classe permet de réaliser un drag and drop en s'appuyant sur le css
*/
class DragAndDrop{
    constructor(){}
    /** fonction dragStart()
    * @debrif quand l'evenement dragstart se déclenche cette fonction permet de récuperer l'id du post-it,
    * et rendre le post-it en question invisible
    */
    dragStart(){
        catchId.push(this.id);
        this.className += ' hold';
        setTimeout(()=> (this.className ='invisible'),0);
    }
    /** fonction dragEnd()
    * @debrif quand l'evenement dragEnd se déclenche cette fonction permet d'attribuer l'element a fill qui sont les post-it
    */
    dragEnd(){
        this.className= 'fill';
    }
    /** fonction dragOver()
    * @debrif quand l'evenement dragover se déclenche c'est à dira quand notre l'element séléctionner et 
    * sur la corbeille on affiche un message de suppression   
    */
    dragOver(e) {
        e.preventDefault();
        var alerted = sessionStorage.getItem('alerted') || '';
        if (alerted != 'yes') {
            alert("Element Will be Deleted !");
            sessionStorage.setItem('alerted','yes');
        }
    }
    /**fonction dragEnter()
    * @debrif quand l'evenement dragenter se déclenche cette fonction attribue le post-it à la classe hovered
    */
    dragEnter(e) {
        e.preventDefault();
        this.className += ' hovered';
    }
    /** fonction dragLeave()
    *  @debrif cette fonction permet juste de faire un signal quand on sors de la zone de suppression
    */
    dragLeave(e){
        e.preventDefault();
    }
    /** fonction dragDrop()
    * @debrif quand l'evenement drop se déclenche cette fonction permet de supprimer le post-it grâce à l'id dans le tableau catchId
    */
    //TODO corriger la suppression dans tableau récuperation
    dragDrop(){
        let element=document.getElementById(catchId[0]);
        suppressionPosTit(catchId[0]);
        document.body.removeChild(element);
        console.log(element.id);
        tableaudepostit.splice((id+3),1);
        catchId.pop();
        sessionStorage.removeItem('alerted');
    }
    /** fonction clicked()
    *  @debrif quand l'evenement click se déclenche cette fonction permet de modifier le text du post-it
    */
    clicked(){
        let text=prompt("Ecrivez quelques chose");
        this.innerHTML=text;
        modificationDePostit(this.id,text);
        
    }
    /** fonction rappel()
    * @debrif quand l'evenement click se déclenche cette fonction fait un alert à l'utilisateur de supprimer
    */
    rappel(){
        alert("Il faut faire un drag & drop pour supprimer un élement");
    }
    
}

/*--------------------------------------------------------------------------REQUETES------------------------------------------------------------------------------------------*/

/** fonction modificationDePostit(idPostit,text)
* @derif cette fonction permet de faire une rêquete au serveur pour modifier le text d'un post-it et bien sûr en met dans le header le token
* @param idPostit l'id de post-it 
* @param text  le text à modifier
*/
function modificationDePostit(idPostit,text){
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/home-modification",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization','Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState==XMLHttpRequest.DONE && xhr.status ==200){
            console.log("xhr response ",xhr.response);
        }
    }
    let donnees="idPostit="+idPostit+"&"+ "text="+text ;
    xhr.send(donnees);
}

/** Fonction suppressionPosTit (idPostit)
* @debrif cette fonction permet de faire une rêquete au serveur pour supprimer un post-it il introduit aussi le token pour permettre l'identification de la personne
* @param idPostit  l'id de post-it à supprimer
*/
function suppressionPosTit(idPostit){ 
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/home-remove",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status ==200){
            console.log('xhr response ',xhr.response);
        }
    }  
    let donnees ="idPostit="+idPostit;    
    xhr.send(donnees);
}

/** Fonction recupererPostItDuServeur()
* @debrif cette fonction permet de récuperer les post it déjà présent dans la base de données
* la reponse du serveur sera un objet JSON on parse toutes les données et on construit des post-it grâce
* à elementFactory la rêquete comporte le token en header parceque c'est une route sécurisé
*/
function recupererPostItDuServeur() {		
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/home-information', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            let obj = JSON.parse(xhr.response);
            for(let i=0;i<obj.length;i++){
                var post_it={id:(obj[i].id),type:'div',text:obj[i].text,axeX:obj[i].coordonneesX,axeY:obj[i].coordonneesY,distance:obj[i].distance,angleX:obj[i].angleX,couleur:obj[i].couleur };
                elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
                tableaudepostit.push(createObject(post_it.id.toString(),post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX));
                
            }            
        }
    }
    xhr.send(null); 				
}

/** fonction recupererNbPostit()
* @debrif cette fonction permet d'éxécuter une rêquete vers le serveurs avec le header Authorization,et permet de récupérer le nombre totale de post-it
* de l'utilisateur c'est trés utile dans le cas de suppression pour éviter les conflit
*/
function recupererNbPostit(){
    var xhr=new XMLHttpRequest();
    xhr.open("GET","/home-init",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status ==200){
            id=xhr.response;
        }
    }  
    xhr.send(null);
}

/** fonction envoyerPostItAuServeur(coordonneesX,coordonneesY,distance,angleX,text,couleur)
* @debrif cette fonction permet d'éxécuter une rêquete vers le serveur avec le header Authorization, et envoie toutes les informations de post-it
* @param idPostit l'id de post-it
* @param coordonneesX les coordonnées de post-it sur l'axe x
* @param coordonneesY les coordonnées de post-it sur l'axe y
* @param distance la distance entre l'origine et le post-it
* @param angleX l'angle entre l'origine et le post-it
* @param text le text du post-it
* @param couleur la couleur du post-it
*/
function envoyerPostItAuServeur(idPostit,coordonneesX,coordonneesY,distance,angleX,text,couleur){
    
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/home-send",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status ==200){
            console.log('xhr response ',xhr.response);
        }
    }  
    let donnees ="idPostit="+idPostit+"&"+"coordonneesX="+coordonneesX+"&"+"coordonneesY="+coordonneesY+"&"+"distance="+distance+"&"+"angle="+angleX+"&"+"text="+text+"&"+"couleur="+couleur;    
    xhr.send(donnees);
}