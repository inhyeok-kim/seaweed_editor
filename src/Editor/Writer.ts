import { SeaweedEditor } from "./Editor";

export default class Writer {
    editor : SeaweedEditor
    pageComp : HTMLElement | null = null
    keyboardMap : KeyboardMap | null =null;

    constructor(editor : SeaweedEditor){
        this.editor = editor
        this.pageComp = editor.pageComp
        this.keyboardMap = new KeyboardMap();
        this.setEventListner();
    }

    setEventListner(){
        // this.pageComp?.addEventListener('focus',this.focusEvent)
        // this.pageComp?.addEventListener('blur',this.blurEvent)
        document.addEventListener('selectionchange',this.selectiOnChangeHandler.bind(this))
        this.pageComp?.addEventListener("keydown",this.keyDownHandler.bind(this));
        this.pageComp?.addEventListener("keyup",this.keyUpHandler.bind(this));
    }

    keyDownHandler(e: KeyboardEvent){
        this.keyboardMap?.keyDown(e.code);
        if(this.keyboardMap?.isOnly(["Enter"])){
            e.preventDefault();
            
        }
    }
    keyUpHandler(e: KeyboardEvent){
        this.keyboardMap?.keyUp(e.code);
    }

    selectiOnChangeHandler(e : Event){
        const selection = document.getSelection();
        if(selection){
            // console.log(selection.getRangeAt(0));
        }
    }
    focusHandler(e : FocusEvent){
        console.log(e);
    }
    blurHandler(e : FocusEvent){
        console.log(e);
    }
}

class KeyboardMap {
    private keyDownMap : {[index : string] : boolean} = {}
    private keyDownCnt : number = 0
    
    keyDown(code : string){
        this.keyDownMap[code] = true;
        this.keyDownCnt++;
    }

    keyUp(code : string){
        this.keyDownMap[code] = false;
        this.keyDownCnt--;
    }

    isOnly(codes : string[]){
        if(this.keyDownCnt === codes.length) {
            for(let i=0; i<codes.length;i++){
                if(!this.keyDownMap[codes[i]]){
                    return false
                }
            }
            return true;
        }

        return false;
    }

    isInclude(codes : string[]){
        for(let i=0; i<codes.length;i++){
            if(!this.keyDownMap[codes[i]]){
                return false;
            }
        }
        return true;
    }

}