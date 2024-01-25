import { SeaweedEditor } from "../SeaweedEditor";
import Model from "../models/Model";
import SwDocument from "./SwDocument";
import SwRegister from "./SwRegister";

export default class SwSelection {
    editor : SeaweedEditor;
    swDoc : SwDocument | undefined;
    #startModel : Model | null = null;
    #startIndex : number | null = null;
    #endModel : Model | null = null;
    #endIndex : number | null = null;

    constructor(editor : SeaweedEditor, swDoc : SwDocument){
        this.editor = editor;
        this.swDoc = swDoc;

        const el = this.editor.editorEl;

        document.onselectionchange = this.selection.bind(this);
    }

    getSelection(){
        return {
            start : this.#startModel
            , startIndex : this.#startIndex
            , end : this.#endModel
            , endIndex : this.#endIndex
            , children : this.getSelectedNodes()
        }
    }

    selection(){
        const selection = document.getSelection();
        if(selection){
            if(selection.rangeCount>0){
                const range = selection.getRangeAt(0);
                let startNode = range?.startContainer;
                this.#startModel = SwRegister.find(startNode)
                this.#startIndex = range?.startOffset;
                
                let endNode = range?.endContainer;
                this.#endModel = SwRegister.find(endNode);
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

    getSelectedNodes() {
        const range = document.getSelection()?.getRangeAt(0);
        let list : Node[] = [];
        if(range){
            const root = range.commonAncestorContainer;
            list.push(root);
            if(root.childNodes.length>1){
                list = list.concat(this.getSelectedChildren(range,root));
            }
        }
        return list;
    }
    
    getSelectedChildren(range : Range, node : Node){
        let list : Node[] = [];
        if(node.hasChildNodes()){
            node.childNodes.forEach(_node =>{
                if(range.intersectsNode(_node)){
                    list.push(_node);
                    list = list.concat(this.getSelectedChildren(range,_node))
                }
            });
        }
        return list;
    }

}