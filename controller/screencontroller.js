window.onload=main;

function addListeners(element,evenement,fonction){

    element.addEventListener(evenement, fonction);

}

class Events{
    
    constructor(){}
    
    controletoken(){
        //TODO le temps entre la redirection et le chargement
        //TODO vérification de la signature du token
        if (localStorage.getItem("token") != null && window.location!="/home") window.location="/home";
    }
}

function main(){
    //Token
    //let controle=new Events();
    //controle.controletoken();

    

}


function target(e){
    var axeX=Math.abs((window.innerWidth/2-e.clientX));
    var axeY=Math.abs((window.innerHeight/2-e.clientY));
    var naxeX=-Math.abs((window.innerWidth/2-e.clientX));
    var naxeY=-Math.abs((window.innerHeight/2-e.clientY));
    //TODO collision quand on bouge l'element
    if(e.clientX<window.innerWidth/2 && e.clientY < window.innerHeight/2){
        //console.log(direction(naxeX,axeY));
        //console.log("degree ",mouseangle(naxeX,axeY));
        for(var ii=0;ii<tabll.length;ii++){
            if(Math.round(tabll[ii].degree)==Math.round( mouseangle(axeX,axeY)) ){       
                console.log("LL ANGLE");
                let element=document.getElementById(tabll[ii].id);
                let left=extractleft(element);
                let top=extracttop(element);
                element.style.left=(left+75)+"px";
                element.style.top=(top+25)+"px";
                if(extractleft(element)>window.innerWidth || extracttop(element)>window.innerHeight){
                    console.log("Depassement");
                    element.style.left=0+"px";
                    element.style.top=0+"px";
                }
            }
        }
    }
    else if(e.clientX<window.innerWidth/2 && e.clientY> window.innerHeight/2){
       //console.log(direction(naxeX,naxeY));
       console.log("degree ",mouseangle(naxeX,naxeY));
       for(var ii=0;ii<tablb.length;ii++){
            if(Math.round(tablb[ii].degree)==Math.round( mouseangle(axeX,axeY)) ){
                console.log("LB ANGLE");
                //TODO angle égaux bouger pareil que ll
            }
        }
    }
    else if(e.clientX>window.innerWidth/2 && e.clientY > window.innerHeight/2){
        //console.log(direction(axeX,naxeY));
        console.log("degree ",mouseangle(axeX,naxeY));
        for(var ii=0;ii<tabrb.length;ii++){
            if(Math.round(tabrb[ii].degree)==Math.round( mouseangle(axeX,axeY) ) ){
                console.log("RB ANGLE");
                //TODO angle égaux bouger pareil que ll
            }
        }
    }
    else{
        //console.log(direction(axeX,axeY));
        console.log("degree ",mouseangle(axeX,axeY));
        for(var ii=0;ii<tabrr.length;ii++){
            if(Math.round(tabrr[ii].degree)==Math.round( mouseangle(axeX,axeY) ) ){
                console.log("RR ANGLE");
                //TODO angle égaux bouger pareil que ll
            }
        }
     //console.log("degree ",mouseangle(axeX,axeY));      
    }
    
}