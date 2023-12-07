import * as ActionProcessor from "./ActionProcessor";
import { SeaweedEditor } from "./SeaweedEditor";
import KeyDownManger from "./KeyDownManger";
import SWDocument from "./SWDocument";

export default class Writer {
    editor : SeaweedEditor
    swDocument : SWDocument
    keyboardMap : KeyDownManger | null =null;
    selection : Selection | null = null;
    range : Range | null = null;

    constructor(editor : SeaweedEditor, swDocument : SWDocument){
        this.editor = editor;
        this.swDocument = swDocument;
        this.keyboardMap = new KeyDownManger();
        this.setEventListner();
    }

    setEventListner(){
        // this.pageComp?.addEventListener('focus',this.focusEvent)
        // this.pageComp?.addEventListener('blur',this.blurEvent)
        document.addEventListener('selectionchange',this.selectionChangeHandler.bind(this))
        this.swDocument.page?.addEventListener("keydown",this.keyDownHandler.bind(this));
        this.swDocument.page?.addEventListener("keyup",this.keyUpHandler.bind(this));
        this.swDocument.page?.addEventListener("paste",this.pasteHandler.bind(this));

    }

    pasteHandler(e : ClipboardEvent){
        // e.stopPropagation();
        // e.preventDefault();
        // const clipboardData = e.clipboardData;
        // const pastedData = clipboardData?.getData('text/html');
        // const domParser = new DOMParser();
        // const doc = domParser.parseFromString(pastedData!, 'text/html');
        // console.log(doc);
    }
    keyDownHandler(e: KeyboardEvent){
        this.keyboardMap?.keyDown(e.code);
        if(this.keyboardMap?.isInclude(["Enter"])){
            e.preventDefault();
            const actionProcess = ActionProcessor.createNewline(this);
            this.swDocument.addActionProcess(actionProcess);
        }
    }
    keyUpHandler(e: KeyboardEvent){
        this.keyboardMap?.keyUp(e.code);
    }

    selectionChangeHandler(e : Event){
        try {
            const selection = document.getSelection();
            this.selection = selection;
            if(selection){
                const range = selection.getRangeAt(0);
                this.range = range;
            }
        } catch (error) {
            console.log('error');
            this.selection = null;
            this.range = null;
        }
    }
    focusHandler(e : FocusEvent){
        console.log(e);
    }
    blurHandler(e : FocusEvent){
        console.log(e);
    }

    
}

