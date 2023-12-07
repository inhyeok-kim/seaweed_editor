import { Action, ActionProcess } from "./ActionProcessor";
import * as ComponentBuilder from "./Component/ComponentBuilder";
import { SeaweedEditor } from "./SeaweedEditor";

export default class SWDocument {
    editor : SeaweedEditor;
    page : HTMLElement;
    private actionQueue : ActionProcess[] = [];
    isLooped : boolean = false;

    constructor(editor : SeaweedEditor){
        this.editor = editor;

        this.page = ComponentBuilder.createPage();
        this.page.appendChild(ComponentBuilder.createTextBlock());
        this.editor.rootEl!.appendChild(this.page);

    }

    addActionProcess(ap : ActionProcess){
        this.actionQueue.push(ap);
        if(!this.isLooped){
            this.startJopLoop();
        }
    }

    startJopLoop(){
        return new Promise((resolve, reject) => { // !
            try {
                this.isLooped = true;
                const actionProcess = this.actionQueue.shift();
                actionProcess?.getQueue().forEach(a=>{
                    this.execActionJop(a);
                });
                if(this.actionQueue.length > 0){
                    this.startJopLoop();
                } else {
                    this.isLooped = false;
                }
            } catch (err) {
              reject(err);
            }
            resolve(true);
          })
    }

    execActionJop(action : Action){
        if(action.type == 'insert'){
            this.insertComponent(action);
        }
    }

    insertComponent(action : Action){
        switch (action.component) {
            case "TextBlock":
                const textBlock = ComponentBuilder.createTextBlock(action.newId);
                insertAfter(action.targetId!,textBlock);
                moveSelection(action.newId!,0,action.newId!,0);
                break;
            default:
                break;
        }
    }

}

function moveSelection(startContainerId : string, startOffset : number, endContainerId : string, endOffset : number){
    var range = document.createRange();
    const startContainer = document.querySelector(`[data-id="${startContainerId}"]`);
    const endContainer = document.querySelector(`[data-id="${endContainerId}"]`);

    range.setStart(startContainer!, startOffset);
    range.setEnd(endContainer!, endOffset);

    var selection = document.getSelection();

    selection!.removeAllRanges();
    selection!.addRange(range);
}

function insertAfter(referenceId : string, newNode : Node) {
    const referenceNode = document.querySelector(`[data-id="${referenceId}"]`);
    if(referenceNode){
        if (referenceNode.nextSibling) {
          referenceNode.parentNode!.insertBefore(newNode, referenceNode.nextSibling);
        } else {
          referenceNode.parentNode!.appendChild(newNode);
        }
    }
}