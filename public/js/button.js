/** Class BS
 *  @debrif cette class créé le button supprimer grâce à la fonction ButtonFactory , et écoute les evenements (click,dragover,dragenter,dragleave,drop)
 */
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
/** Class BA
 *  @debrif cette class créé le button Ajouter grâce à la fonction ButtonFactory , et écoute l'evenement click quand il sera déclencher 
 * on accède à la fonctionnalité ajout post-it
 */
class BA{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        var newPost_it=new Postit();
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",newPost_it.ajoutPostit);
    }
}
/** Class BD
 *  @debrif cette class créé le button deconnexion grâce à la fonction ButtonFactory , et écoute l'evenement click
 */
class BD{
    
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",deconnexion);
    }
}

class BP{
    constructor(idbutton,classbutton,classspan,left,right,top,bottom){
        this.element=ButtonFactory(idbutton,classbutton,classspan,left,right,top,bottom);
        addListeners(this.element,"click",play);
    }
}