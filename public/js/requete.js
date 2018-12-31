/** Fonction recupererDuServeur()
 * @debrif cette fonction permet de récuperer les post it déjà présent dans la base de données
 * 
 */
function recupererDuServeur() {		
    var newPost_it=new Postit(); 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/home.information', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var values = xhr.response;
            console.log("xhr",xhr.response);
            let obj = JSON.parse(values);
            for(let i=0;i<obj.length;i++){
                newPost_it.chargerPostit(obj[i].coordonneesX,obj[i].coordonneesY,obj[i].text,obj[i].couleur);
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