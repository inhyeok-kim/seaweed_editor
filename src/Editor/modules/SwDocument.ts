import { SeaweedEditor } from "../SeaweedEditor";
import List from "../models/List";
import ListItem from "../models/ListItem";
import Model from "../models/Model";
import Paragraph from "../models/Paragraph";
import Text from "../models/Text";
import {nanoid} from 'nanoid';

export default class SwDocument{
    editor : SeaweedEditor;
    mocument : Model[] = [];
    mocuMap : {[key : string] : Model} = {};
    #removedListByApi : string[] = [];

    constructor(editor : SeaweedEditor, document? : string){
        this.editor = editor;
        this.editor.editorEl!.addEventListener('beforeinput',this.beforeInputEventHandler.bind(this));
        // this.editor.editorEl!.addEventListener('input',this.inputEventHandler.bind(this));
        // this.editor.editorEl?.addEventListener('paste',this.pasteEventHandler.bind(this));

        if(document){
            // this.#mocument = document;
            this.convertJsonToModel(document)
        } else {
            const startParagraph = Paragraph.create(nanoid());
            const startText = Text.create(nanoid());
            startParagraph.appendAt(startText);
            this.mocuMap[startParagraph.key] = startParagraph;
            this.mocuMap[startText.key] = startText;
            this.mocument.push(startParagraph);
        }
        this.render();

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
    }

    inputEventHandler(e:Event){
        const inputType = (e as InputEvent).inputType;
        e.preventDefault();
        if(inputType === 'deleteContentBackward'){
            this.editor.swSelection?.selection();
            // const selection = getSelection();
            // console.log(selection!.);
        } else {
            const data = (e as InputEvent).data;
            const selection = this.editor.swSelection?.getSelection();
        }
    }

    beforeInputEventHandler(e:Event){
        const ev = e as InputEvent;
        // const ranges = ev.getTargetRanges();
        // if(ranges.length > 1){
        this.getSelectedNodes();
        //     e.preventDefault();
        // }
    }

    pasteEventHandler(e:ClipboardEvent){
        const paste = e.clipboardData!.getData("text/html");
        // console.log(paste);
        var doc = new DOMParser().parseFromString(paste, "text/html");
        const mocu = this.parseHtmlTreeToModelTree(doc.body.childNodes);
        const selection = this.editor.swSelection?.getSelection();
        mocu.forEach(model => {
            const target = selection?.start;
            if(target){
                if(Object.getPrototypeOf(target).constructor.isContainer){
                    target?.appendAt(model);
                } else {
                    target.parent?.appendAtKey(model,target.key!,'after');
                }
            }
        });
        e.preventDefault();
    }   

    parseHtmlTreeToModelTree(list : NodeList){
        const tree : Model[] = [];
        list.forEach(node=>{
            const model = this.convertElementToModel(node);
            if(model){
                tree.push(model);
                this.mocuMap[model.key] = model;
                this.parseHtmlTreeToModelTree(node.childNodes).forEach(child=>{
                    // console.log(model.dom,Object.getPrototypeOf(model).constructor.isContainer);
                    if(Object.getPrototypeOf(model).constructor.isContainer){
                        model?.appendAt(child);
                    } else {
                        model.parent?.appendAtKey(child,model.key!,'after');
                    }
                });
            }
        });
        return tree;
    }

    convertElementToModel(node : Node){
        let model;
        switch (node.nodeName) {
            case 'UL':
                model = List.create(nanoid());
                break;
            case 'LI':
                model = ListItem.create(nanoid());
                break;
            case 'P':
                model = Paragraph.create(nanoid());
                break;
            case 'DIV':
                model = Paragraph.create(nanoid());
                break;
            case 'SPAN':
                model = Text.create(nanoid());
                break;
            case '#text':
                const text = node.textContent;
                if(text!.replace(/\n/g,'').length > 0){
                    model = Text.create(nanoid(),node.textContent!);
                }
                break;
            default:
                break;
        }
        return model;
    }

    removeModel(model : Model){
        if(model){
            delete this.mocuMap[model.key];
            model.remove();
            // console.log(this.mocument);
        }
    }

    newLine(model : Model){
        let target = model;
        if(!Object.getPrototypeOf(model).constructor.isContainer){
            target = model.parent!;
        }
        const newModel = (Object.getPrototypeOf(target).constructor.create)(nanoid());
        this.mocuMap[newModel.key] = newModel;
        if(target.parent){
            target.parent.appendAtKey(newModel,target.key,'after');
        } else {
            const index = this.mocument.findIndex(_m=>_m.key = target.key);
            if(index === this.mocument.length-1){
                this.mocument.push(newModel);
                this.editor.editorEl?.appendChild(newModel.dom!);
            } else {
                this.editor.editorEl?.insertBefore(newModel.dom!,this.mocument[index+1].dom!);
                this.mocument.splice(index+1,0,newModel);
            }
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
                console.log(list);
            }
        }
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