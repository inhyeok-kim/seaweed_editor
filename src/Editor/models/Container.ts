export default class Model{
    key : string;
    parent : Model | null = null;
    children : Model[] = [];
    dom : Node | null = null;
    #domType :string = '';
    
    constructor(key:string){
        this.key = key;
        this. dom = this.createDom();
    }

    createDom(){
        const dom = document.createElement(this.#domType);
        return dom;
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
                this.dom!.insertBefore(children[index].dom!,child.dom!);
                children.splice(index,0,child);
            }
        } else {
            this.dom?.appendChild(child.dom!);
            children.push(child);
        }

        if(child.parent){
            child.parent.removeChild(child);
        }
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
    }

    removeChild(child : Model | string){
        let children = this.children;
        if(typeof child === "string"){
            children.splice(children.findIndex(m=>m.key ===child),1);
        } else {
            children.splice(children.findIndex(m=>m.key ===child.key),1);
        }
    }

}