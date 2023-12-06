import { SeaweedEditor } from "./Editor";

export default class Writer {
    editor : SeaweedEditor
    pageComp : HTMLElement | null = null

    constructor(editor : SeaweedEditor){
        this.editor = editor
        this.pageComp = editor.pageComp

        this.setEventListner();
    }

    setEventListner(){
        // this.pageComp?.addEventListener('focus',this.focusEvent)
        // this.pageComp?.addEventListener('blur',this.blurEvent)
        document.addEventListener('selectionchange',this.selectionchangeEvent)
    }

    selectionchangeEvent(e : Event){
        const selection = document.getSelection();
        if(selection){
            console.log(selection.getRangeAt(0));
        }
    }
    focusEvent(e : FocusEvent){
        console.log(e);
    }
    blurEvent(e : FocusEvent){
        console.log(e);
    }
}