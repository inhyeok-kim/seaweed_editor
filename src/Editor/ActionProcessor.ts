import Writer from "./Writer";

declare global {
    interface Node {
        dataset : any
    }
}

export function createNewline(writer:Writer){
    if(writer.selection && writer.range){
    const actions : Action[] = [];
    let selection : Selection;
    let range : Range;
        selection = Object.assign(writer.selection as Selection);
        range = Object.assign(writer.range as Range);
        if(range){
            let startContainer;
            let startContainerId;
            let endContainer;
            let endContainerId;
            if(range.startContainer.nodeName == '#text'){
                startContainer = range.startContainer.parentElement;
                startContainerId = startContainer?.dataset.id;
            }
            if(range.startContainer.nodeName == 'DIV'){
                startContainerId = range.startContainer.dataset.id;
                startContainer = document.querySelector(`[data-id="${startContainerId}"]`);
            }
            if(range.endContainer.nodeName == '#text'){
                endContainer = range.endContainer.parentElement;
                endContainerId = endContainer?.dataset.id;
            }
            if(range.endContainer.nodeName == 'DIV'){
                endContainerId = range.endContainer.dataset.id;
                endContainer = document.querySelector(`[data-id="${startContainerId}"]`);
            }
            if(startContainer && endContainer){
                actions.push({
                    newId : crypto.randomUUID(),
                    type : 'insert',
                    targetId : startContainerId,
                    component : 'TextBlock'
                });
            }
    
        }

        const ap = new ActionProcess(actions);
        ap.needSelectionMove = true;
        return ap;

    }
    return new ActionProcess();
}

export interface Action {
    newId? : string
    targetId? : string
    text? : string
    type : 'delete'|'update'|'insert'
    component? : 'TextBlock'
}

export class ActionProcess {
    private actionQueue : Action[] = [];
    size : number = 0;
    needSelectionMove : boolean = false;
    
    constructor(actionList? : Action[]){
        if(actionList){
            this.actionQueue = actionList;
            this.size = actionList.length;
        }
    }

    getQueue(){
        return this.actionQueue;
    }
    dequeue(){
        if(this.size > 0){
            this.size--;
            return this.actionQueue.shift();
        }
        return null;
    }
    enqueue(action : Action){
        this.size = this.actionQueue.push(action);
        return this.size;
    }

}