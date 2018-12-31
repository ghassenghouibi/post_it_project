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

class BA{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        var newPost_it=new Postit();
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",newPost_it.ajoutPostit);
    }
}
class BD{
    
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",deconnexion);
    }
}

function deconnexion(){
    selectionnerPostit();
    window.location = "/";
    localStorage.removeItem('token');
}


//TODO envoyer la distance et l'angle en fonction de la taille d'écran
function selectionnerPostit(){
    let element =document.querySelectorAll(".fill");
        for(const s of element){
            envoyerAuServeur(extractleft(s),extracttop(s),0,0,(s.innerHTML),(s.style.backgroundColor));
        }
}

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
    var payLoad ="token="+JSON.parse(localStorage.getItem('token'))+"&"+"coordonneesX="+coordonneesX+"&"+"coordonneesY="+coordonneesY+"&"+"distance="+distance+"&"+"angle="+angleX+"&"+"text="+text+"&"+"couleur="+couleur;    
    xhr.send(payLoad);
}
