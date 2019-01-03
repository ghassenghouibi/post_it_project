window.onload = main;

var id=0;
var tableauderecuperation=new Array();

/** Class controller qui va gérer tous les différentes actions du post-it
 * l'ajout d'un nouveau post-it par exemple
 * la suppression de post-it
 * 
 */
class Postit{
    constructor(){}
    /** Fonction qui permet d'ajouter un nouveau post it 
    *  @debrif la fonction utilise des positions random et une couleur random aussi
    */
    ajoutPostit(){
        var text=prompt('Ecrivez le Text de post it S\'il vous plait'); 
        var post_it = {
            id:(++id),
            type:'div',
            text:text,
            axeX : getRandomIntInclusive(0,1650),
            axeY: getRandomIntInclusive(0,700),
            distance: 0,
            angleX:0,
            couleur:randomColor()
        };

        post_it.distance=calculdistance(post_it.axeX,post_it.axeY);
        var addx,addy;
        
        if(post_it.axeX> window.innerWidth/2 ) addx=-100;
        else addx=+100;
        if(post_it.axeY> window.innerHeight/2 ) addy=-125;
        else addy=+125;
        
        var x=-convertoplanx(post_it.axeX+addx);
        var y=convertoplany(post_it.axeY+addy);        
        post_it.angleX=Math.abs(getAngleDeg(x,y));
        console.log(" =",post_it.axeX,post_it.axeY);
        elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
        tableauderecuperation.push(createObject(id.toString(),post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX));
        envoyerAuServeur(post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX,post_it.text,post_it.couleur);

    }
    
    
}

/** fonction deconnexion() 
* @debrif evenement se déclenche quand on click sur le button deconnexion on selectionne 
* tous les post-it on les envoie au serveur aprés on change la vue et on supprime le token 
*/
function deconnexion(){
    window.location = "/";
    localStorage.removeItem('token');
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
    xhr.setRequestHeader('Authorization', 'Bearer '+JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status ==200){
            alert('xhr response ',xhr.response);
        }
    }  
    var payLoad ="coordonneesX="+coordonneesX+"&"+"coordonneesY="+coordonneesY+"&"+"distance="+distance+"&"+"angle="+angleX+"&"+"text="+text+"&"+"couleur="+couleur;    
    xhr.send(payLoad);
}

function selectXById(tableauderecuperation,id){
    for(let i = 0 ;i<tableauderecuperation.length;i++){
        if(tableauderecuperation[i].id==id){
            return tableauderecuperation[i].posx;
        }
    }
}

function selectYById(tableauderecuperation,id){
    for(let i = 0 ;i<tableauderecuperation.length;i++){
        if(tableauderecuperation[i].id==id){
            return tableauderecuperation[i].posy;
        }
    }
}

/** Fonction recupererDuServeur()
* @debrif cette fonction permet de récuperer les post it déjà présent dans la base de données
* la reponse du serveur sera un objet JSON on parse toutes les données et on construit des post-it grâce
* à elementFactory la rêquete comporte le token en header parceque c'est une route sécurisé
*/
function recupererDuServeur() {		
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/home.information', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            let obj = JSON.parse(xhr.response);
            console.log("---> ",xhr.response);
            for(let i=0;i<obj.length;i++){
                var post_it={id:(++id),type:'div',text:obj[i].text,axeX:obj[i].coordonneesX,axeY:obj[i].coordonneesY,distance:obj[i].distance,angleX:obj[i].angleX,couleur:obj[i].couleur };
                elementFactory(post_it.id,post_it.type,post_it.text,post_it.axeX,post_it.axeY,post_it.couleur);
                tableauderecuperation.push(createObject(post_it.id.toString(),post_it.axeX,post_it.axeY,post_it.distance,post_it.angleX));

            }            
        }
    }
    xhr.send(null); 				
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
    requestAnimationFrame(boucleDeselectionDePostit);   
}


function anglemoveY(angle){
    if (Math.round(angle)>50){
        return 0;
    }
    else{
        return 5;
    }
}

//TODO corriger le déplacement 
//TODO corriger la collision
function deplacement(element,position,degree){
    console.log("degree ",degree);
    var x=(extractleft(element));
    var y=(extracttop(element));
    console.log("ddd ",position);
    if(x>=0 && y>=0 )   element.style.display='block';
    else                element.style.display='none';
    if(x<innerWidth-200 && y<innerHeight-250){
        switch(position){
            case "ll":
                console.log("heyyyy");
                element.style.left=(++x)+"px";
                element.style.top=(++y)+"px";
                break;
            case "lb":
                element.style.left=(++x)+"px";
                element.style.top=(--y)+"px";
                break;
            case "rr":
                element.style.left=(--x)+"px";
                element.style.top=(++y)+"px"; 
                break;
            case "rb":
                element.style.left=(--x)+"px";
                element.style.top=(--y)+"px";
                break;
            default:
                break;
        }
    }
    else{
        element.style.left=-selectXById(tableauderecuperation,element.id)+"px";
        element.style.top=-selectYById(tableauderecuperation,element.id)+"px";
    }
    console.log("-> ",element);
}
function target(e){
    
    //console.log(getdirection(e.clientX,e.clientY));
    //console.log("client Angle ->",getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY)));
    for(let i=0;i<tableauderecuperation.length;i++){
        if(Math.round(getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY))) >= Math.round(tableauderecuperation[i].degree) -5 || Math.round(tableauderecuperation[i].degree) +5   <= Math.round(getAngleDeg(convertoplanx(e.clientX),convertoplany(e.clientY))) ){
            if(tableauderecuperation[i].position == getdirection(e.clientX,e.clientY)){
                let element=document.getElementById(tableauderecuperation[i].id);
                switch(tableauderecuperation[i].position){
                    case "ll":
                        deplacement(element,"ll",tableauderecuperation[i].degree);
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

function play(e){
    e.stopImmediatePropagation();
    
    var clicked = sessionStorage.getItem('clicked') || '';
    if(clicked == 'yes') sessionStorage.setItem('clicked','no');
    else  sessionStorage.setItem('clicked','yes');

    if (clicked == 'yes') {
        console.log("ON");
        window.addEventListener("mousemove",target);
    }
    else{
        console.log("OFF");
        window.removeEventListener("mousemove",target);
    }
}
function main (){
    recupererDuServeur();
    boucleDeselectionDePostit();
    var supprimer=new BS("Supprimer","btn btn-danger","glyphicon glyphicon-trash",0,undefined,undefined,0);
    var ajouter=new BA("Ajouter","btn btn-success","glyphicon glyphicon-plus-sign",undefined,0,undefined,0);
    var deconnexion=new BD("Ajouter","btn btn-warning","glyphicon glyphicon-log-out",undefined,0,0,undefined);
    var play=new BP("Bouger","btn btn-info","glyphicon glyphicon-play-circle",0,0,undefined,undefined);

    centre();


}