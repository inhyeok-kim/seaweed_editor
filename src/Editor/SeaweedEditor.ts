import SwDocument from "./modules/SwDocument";
import SwSelection from "./modules/SwSelection";

export class SeaweedEditor {
    rootEl : HTMLElement | null = null;
    editorEl : HTMLDivElement | null = null;
    swDocument : SwDocument | undefined;
    swSelection : SwSelection | undefined;

    selectionChangeHandlers : Function[] = [];
    contentsChangeHandlers : Function[] = [];

    constructor(elem : string | HTMLElement){
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
        
        fetch('/test/Test.json')
        .then(res=>res.text())
        .then(text => {
            this.swDocument = new SwDocument(this,text);
            this.swSelection = new SwSelection(this, this.swDocument);
        })

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

    

}

export default function createEditor(elem:string | HTMLElement){
    return new SeaweedEditor(elem);
};