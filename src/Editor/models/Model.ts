import { nanoid } from "nanoid";

export default class Model{
    key : string;
    parent : Model | null = null;
    children : Model[] = [];
    dom : Element | null = null;
    index : number = 0
    static domType :string = '';
    static isContainer : boolean = false;
    
    constructor(key:string, arg? : any){
        this.key = key;
    }

    static create(key:string,arg? : any){
        const model = new this(key);
        const dom = document.createElement(this.domType);
        dom.dataset.id = key;
        model.dom = dom;
        return model;
    }

    appendAt(child : Model,index?:number){
        let children = this.children;
        if(index){
            if(index > children.length || index < 0){
                throw Error
            } else if(index == children.length) {
                this.dom?.appendChild(child.dom!);
                children.push(child);
            } else {
                this.dom!.insertBefore(child.dom!,children[index].dom!);
                children.splice(index,0,child);
            }
        } else {
            this.dom?.appendChild(child.dom!);
            children.push(child);
        }

        if(child.parent){
            child.parent.removeChild(child);
        }
        child.parent = this;
    }

    appendAtKey(child : Model, key : string, direction : 'before'|'after'){
        let children = this.children;
        if(children.length === 0){
            this.dom?.appendChild(child.dom!);
            children.push(child);
        } else {
            let index = children.findIndex(c=>c.key === key);
            if(direction === 'after') index++;
            if(direction === 'before') index--;
            this.appendAt(child,index);
        }

        if(child.parent){
            child.parent.removeChild(child);
        }
        child.parent = this;
    }

    removeChild(child : Model | string){
        let children = this.children;
        if(typeof child === "string"){
            children.splice(children.findIndex(m=>m.key ===child),1);
        } else {
            children.splice(children.findIndex(m=>m.key ===child.key),1);
        }
    }

    remove(){
        if(this.parent){
            this.parent.removeChild(this);
            console.log('remove ', this.key);
        }
    }

}