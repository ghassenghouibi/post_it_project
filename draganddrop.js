var catchId=new Array();
/** Class Drag And Drop
 *  @derif cette classe permet de réaliser un drag and drop en s'appuyant sur le css
 */
class DragAndDrop{
    constructor(){
    }
    /** fonction dragStart()
     * @debrif quand l'evenement dragstart se déclenche cette fonction permet de récuperer l'id du post-it et rendre le post-it en question invisible
     */
    dragStart(){
        console.log("STYAAAAAAARY");
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
     * @debrif quand l'evenement dragover se déclenche c'est à dira quand notre l'element séléctionner et sur la corbeille on affiche un message de suppression   
     */
    //TODO changement en fênetre si c'est possible ^_^
    dragOver(e) {
        var alerted = sessionStorage.getItem('alerted') || '';
        if (alerted != 'yes') {
            alert("Element Will be Deleted !");
            sessionStorage.setItem('alerted','yes');
        }
        e.preventDefault();
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
    dragDrop(){
        let element=document.getElementById(catchId[0]);
        console.log(element);
        suppressionDePosTit(extractleft(element),extracttop(element));
        document.body.removeChild(element);
        catchId.pop();
        sessionStorage.removeItem('alerted');
    }
    /**
     * 
     */
    //TODO modification dans la base de données
    clicked(){
        var text=prompt("Ecrivez quelques chose");
        this.innerHTML=text;
        modificationDePostit(extractleft(this),extracttop(this),text);

    }
    /** fonction rappel()
     * @debrif quand l'evenement click se déclenche cette fonction fait un alert à l'utilisateur de supprimer
    */
    rappel(){
        alert("Il faut faire un drag & drop pour supprimer un élement");
    }

}
//TODO modifier les valeur coordonnesX et coordoneesY
/** Fonction suppressionDePosTit (coordonneesX,coordonneesY)
 * @debrif cette fonction permet de faire une rêquete au serveur pour supprimer un post-it il introduit aussi le token pour permettre l'identification de la personne
 * @param coordonneesX  coordonnéesX de post-it vu qu'un post-it peut avoir une seule position
 * @param coordonneesY  coordonnéesY sur l'axe Y
 */
function suppressionDePosTit(coordonneesX,coordonneesY){

    var xhr=new XMLHttpRequest();
    xhr.open("POST","/home.remove",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status ==200){
            console.log('xhr response ',xhr.response);
        }
    }  
    var payLoad ="coordonneesX="+coordonneesX+"&"+"coordonneesY="+coordonneesY;    
    xhr.send(payLoad);
}
function modificationDePostit(coordonneesX,coordonneesY,text){
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/home.modification",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization','Bearer ' + JSON.parse(localStorage.getItem('token')));
    xhr.onreadystatechange=function(){
        if(xhr.readyState==XMLHttpRequest.DONE && xhr.status ==200){
            console.log("xhr response ",xhr.response);
        }
    }
    var payLoad="text="+text+"&" + "coordonneesX=" +coordonneesX + "&"+"coordonneesY="+coordonneesY;
    xhr.send(payLoad);
}