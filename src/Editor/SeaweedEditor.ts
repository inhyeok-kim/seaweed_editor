import SwDocument from "./modules/SwDocument";
import SwSelection from "./modules/SwSelection";

export class SeaweedEditor {
    rootEl : HTMLElement | null = null;
    editorEl : HTMLDivElement | null = null;
    swDocument : SwDocument | undefined;
    swSelection : SwSelection | undefined;

    selectionChangeHandlers : Function[] = [];
    contentsChangeHandlers : Function[] = [];

    constructor(elem : string | HTMLElement, isNew : boolean){
        let rootEl;

        if(typeof elem == "string"){
            rootEl = document.getElementById(elem);
        } else if(elem instanceof HTMLElement){
            rootEl = elem;
        } else {
            console.error("제공된 인자는 id 또는 HTMLElement여야 합니다.");
            return;
        }

        if(!rootEl){
            console.error("에디터 생성에 실패하였습니다. 제공된 인자를 확인해주세요.");
            return;
        }
        this.rootEl = rootEl;

        const editorEl = document.createElement('div');
        editorEl.setAttribute('contenteditable','true');
        this.editorEl = editorEl;
        rootEl.appendChild(editorEl);
        
        this.swDocument = new SwDocument(this,isNew);
        this.swSelection = new SwSelection(this, this.swDocument);

    }

    on(event:'selection_change'|'contents_change',fuc:Function){
        switch (event) {
            case 'contents_change':
                this.contentsChangeHandlers.push(fuc);
                break;
            case 'selection_change':
                this.selectionChangeHandlers.push(fuc);
                break;
        }
    }

    getDocument(){
        return this.swDocument?.getMocument();
    }

    setBold(){
        console.log(this.swSelection?.getSelection());
    }

    pushDataModel(dataModel : any){
        this.swDocument!.applyDataModel(dataModel);
    }

    

}

export default function createEditor(elem:string | HTMLElement,isNew : boolean){
    return new SeaweedEditor(elem, isNew);
};