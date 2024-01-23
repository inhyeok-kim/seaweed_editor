import { SeaweedEditor } from "../SeaweedEditor";
import Model from "../models/Model";
import SwDocument from "./SwDocument";

export default class SwSelection {
    editor : SeaweedEditor;
    swDoc : SwDocument | undefined;
    #startModel : Model | null = null;
    #startIndex : number | null = null;
    #endModel : Model | null = null;
    #endIndex : number | null = null;
    #betweenModels : Model[] | null = null;

    constructor(editor : SeaweedEditor, swDoc : SwDocument){
        this.editor = editor;
        this.swDoc = swDoc;

        const el = this.editor.editorEl;

        document.onselectionchange = this.selection.bind(this);
    }

    findModelByEl(el : any){
        let model;
        if(el){
            if(this.swDoc){
                if(el.dataset){
                    const key = el.dataset.id;
                    model = this.swDoc.mocuMap[key];
                }
            }
        }
        if(!model) model = null;
        return model;
    }

    getSelection(){
        return {
            start : this.#startModel
            , startIndex : this.#startIndex
            , end : this.#endModel
            , endIndex : this.#endIndex
        }
    }

    selection(){
        const selection = document.getSelection();
        if(selection){
            if(selection.rangeCount>0){
                const range = selection.getRangeAt(0);
                let startNode : any;
                if(range?.startContainer?.nodeName === '#text'){
                    startNode = range?.startContainer.parentElement;
                } else {
                    startNode = range?.startContainer;
                }
                this.#startModel = this.findModelByEl(startNode)
                this.#startIndex = range?.startOffset;
                
                let endNode : any;
                if(range?.endContainer?.nodeName === '#text'){
                    endNode = range?.endContainer.parentElement;
                } else {
                    endNode = range?.endContainer;
                }
                this.#endModel = this.findModelByEl(endNode);
                this.#endIndex = range?.endOffset;
        
                this.editor.selectionChangeHandlers.forEach(f=>{f(this.getSelection())});
            } else {
                this.#startModel = null;
                this.#startIndex = null;
                this.#endModel = null;
                this.#endIndex = null;
            }
        } else {
            this.#startModel = null;
            this.#startIndex = null;
            this.#endModel = null;
            this.#endIndex = null;
        }

    }

    

}