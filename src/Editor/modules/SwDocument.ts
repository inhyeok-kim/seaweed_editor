import { SeaweedEditor } from "../SeaweedEditor";
import Model from "../models/Model";
import Paragraph from "../models/Paragraph";
import Text from "../models/Text";

export default class SwDocument{
    editor : SeaweedEditor;
    mocument : Model[] = [];
    mocuMap : {[key : string] : Model} = {};
    #removedListByApi : string[] = [];

    constructor(editor : SeaweedEditor, document? : string){
        this.editor = editor;
        this.editor.editorEl!.addEventListener('input',this.inputEventHandler.bind(this));

        if(document){
            // this.#mocument = document;
            this.convertJsonToModel(document)
        }
        this.render();
    }


    render(){
        this.mocument.forEach(model=>{
            this.editor.editorEl?.appendChild(model.dom!);
        });
    }
    
    convertJsonToModel(obj : string){
        const doc = JSON.parse(obj);
        doc.forEach((model : any)=>{
            const m = this.convertObjToModel(model);
        });
    }

    convertObjToModel(obj : any){
        let m;
        switch (obj.type) {
            case 'text':
                m = Text.create(obj.key,obj.text);
                break;
            case 'paragraph':
                m = Paragraph.create(obj.key);
                break;
            default:
                break;
        }
        if(m){
            this.mocuMap[m.key] = m;
            if(obj.parent === "0"){
                this.mocument.push(m);
            } else {
                this.mocuMap[obj.parent].appendAt(m);
            }
        }    

        if(obj.children && obj.children.length > 0){
            obj.children.forEach((child:any)=>{
                this.convertObjToModel(child);
            });
        }

        const config : MutationObserverInit = { characterData: true, childList: true, subtree: true };
        const callback = (mutationList : MutationRecord[], observer : any) => {
            for (const mutation of mutationList) {
                // console.log(mutation);
                mutation.removedNodes.forEach(node=>{
                    if(node.nodeName === '#text'){
                    } else {
                        const id = (node as any).dataset.id;
                        if(this.#removedListByApi.includes(id)){ // api로 인해 삭제된 거였을 경우
                            this.#removedListByApi.splice(this.#removedListByApi.indexOf(id),1);
                            return false;
                        } else { // user로 인해 삭제된 거였을 경우
                            this.removeModel(this.mocuMap[id]);
                        }
                    }
                })
            }
          };
        const observer = new MutationObserver(callback);

        observer.observe(this.editor.editorEl!, config);
    }

    inputEventHandler(e:Event){
        const inputType = (e as InputEvent).inputType;
        if(inputType === 'deleteContentBackward'){
            this.editor.swSelection?.selection();
            // const selection = getSelection();
            // console.log(selection!.);
        }
    }

    removeModel(model : Model){
        if(model){
            delete this.mocuMap[model.key];
            model.remove();
            console.log(this.mocument);
        }
    }

}