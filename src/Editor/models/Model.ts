import { nanoid } from "nanoid";
import SwRegister, { MODEL_KEY } from "../modules/SwRegister";

export default class Model{
    key : string;
    parent : Model | null = null;
    children : Model[] = [];
    dom : Node | null = null;
    index : number = 0
    static domType :string = '';
    static isContainer : boolean = false;
    
    constructor(key:string, arg? : any){
        this.key = key;
    }

    static apply(domNode : Node, arg? : any) {
        const model = new this(nanoid(),arg);
        //@ts-ignore
        domNode[MODEL_KEY] = model;
        model.dom = domNode;
        // console.log("new Model", model);
        return model;
    }

    static create(key:string,arg? : any){
        const model = new this(key,arg);
        if(this.domType === '#text'){
            model.dom = document.createTextNode("");
        } else {
            model.dom = document.createElement(this.domType);
        }
        //@ts-ignore
        model.dom[MODEL_KEY] = model;
        
        // console.log("new Model", model);
        return model;
    }

    format(){
        const f = {
            key : this.key,
            parentKey : this.parent?.key,
        }
        if(this.dom?.previousSibling){
            //@ts-ignore
            if(this.dom.previousSibling[MODEL_KEY]){
                //@ts-ignore
                f.previousSibling = this.dom?.previousSibling[MODEL_KEY].key
            }
        } else if (this.dom?.nextSibling){
            //@ts-ignore
            if(this.dom?.nextSibling[MODEL_KEY]){
                //@ts-ignore
                f.nextSibling = this.dom?.nextSibling[MODEL_KEY].key
            }
        }

        return f;
    }

    appendAt(child : Model,index?:number,needDomAppend? : boolean){
        let children = this.children;
        if(!child.parent){
            child.parent = this;
        } else if(child.parent != this){
            child.parent.removeChild(child);
            child.parent = this;
        }

        if(index){
            if(index > children.length || index < 0){
                index = 0;
            }
            if(index == children.length) {
                if(needDomAppend){
                    this.dom?.appendChild(child.dom!);
                }
                children.push(child);
            } else {
                if(needDomAppend){
                    this.dom!.insertBefore(child.dom!,children[index].dom!);
                }
                children.splice(index,0,child);
            }
        } else {
            if(needDomAppend){
                this.dom?.appendChild(child.dom!);
            }
            children.push(child);
        }

    }

    appendAtKey(child : Model, key : string, direction : 'before'|'after',needDomAppend? : boolean){
        let children = this.children;
        if(child.parent){
            child.parent.removeChild(child);
        }
        child.parent = this;

        if(children.length === 0){
            if(needDomAppend){
                this.dom?.appendChild(child.dom!);
            }
            children.push(child);
        } else {
            let index = children.findIndex(c=>c.key === key);
            if(direction === 'after') index++;
            if(direction === 'before') index--;
            this.appendAt(child,index,needDomAppend);
        }

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
            //@ts-ignore
            delete this.dom[MODEL_KEY];
        } else {
            //@ts-ignore
            delete this.dom[MODEL_KEY];
        }
        // console.log('remove ', this);
        return this.key;
    }

}