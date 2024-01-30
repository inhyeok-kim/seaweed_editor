import { SeaweedEditor } from "../SeaweedEditor";
import List from "../models/List";
import ListItem from "../models/ListItem";
import Model from "../models/Model";
import Paragraph from "../models/Paragraph";
import Text from "../models/Text";
import {nanoid} from 'nanoid';
import SwRegister, { MODEL_KEY } from "./SwRegister";
import BreakLine from "../models/BreakLine";

const OBSERVER_CONFIG : MutationObserverInit = {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
};

export default class SwDocument{
    editor : SeaweedEditor;
    mocument : Model[] = [];
    mocuMap : {[key : string] : Model} = {};
    remoteCreateKey : {[key : string] : boolean} = {};
    remoteRemoveKey : {[key : string] : boolean} = {};
    remoteUpdateKey : {[key : string] : boolean} = {};
    mutation : MutationObserver;

    constructor(editor : SeaweedEditor, isNew : boolean){
        this.editor = editor;
        //@ts-ignore
        this.editor.editorEl[MODEL_KEY] = 'root';

        this.editor.editorEl?.addEventListener('input',this.inputEventHandler.bind(this));

        this.render();

        SwRegister.addType("#text" ,Text);
        SwRegister.addType("P" ,Paragraph);
        SwRegister.addType("UL" ,List);
        SwRegister.addType("OL" ,List);
        SwRegister.addType("LI" ,ListItem);
        SwRegister.addType("BR" ,BreakLine);


        const callback = (mutationList : MutationRecord[], observer : any) => {
            this.update(mutationList);
        };
        const observer = new MutationObserver(callback);
        this.mutation = observer;
        observer.observe(this.editor.editorEl!, OBSERVER_CONFIG);

        if(isNew){
            const startParagraph = document.createElement("p");
            startParagraph.appendChild(document.createElement("br"));
            this.editor.editorEl?.appendChild(startParagraph);
        }
    }

    insertModel(node : Node){
        const oldModel = SwRegister.find(node);
        if(oldModel){
            const key = oldModel.remove();
            this.editor.contentsChangeHandlers.forEach(f=>{
                f({
                    type : 'remove',
                    key : key
                });
            })
            delete this.mocuMap[key];
        }
        const model = SwRegister.create(node);
        if(model){
            this.mocuMap[model.key] = model;
            if(!model.dom.parentNode){
                return null;
            }
            const parent = SwRegister.find(model.dom.parentNode);
            const dataModel : any = {
                type : 'create',
                tagName : Object.getPrototypeOf(model).constructor.domType,
            };
            if(parent){
                // dataModel.parent = parent.key;
                if((model.dom as Node).previousSibling){
                    //@ts-ignore
                    const prevModel = (model.dom as Node).previousSibling[MODEL_KEY];
                    if(prevModel){
                        (parent as Model).appendAtKey(model,prevModel.key,"after");
                    }
                } else if((model.dom as Node).nextSibling){
                    //@ts-ignore
                    const nextModel = (model.dom as Node).nextSibling[MODEL_KEY];
                    if(nextModel){
                        (parent as Model).appendAtKey(model,nextModel.key,"before");
                    } else {
                        (parent as Model).appendAt(model);
                    }
                } else {
                    (parent as Model).appendAt(model);
                }
            }
            dataModel.format = model.format();
            this.editor.contentsChangeHandlers.forEach(f=>{
                f(dataModel);
            })
            node.childNodes.forEach(child=>{this.insertModel(child)});
        }
    }

    update(mutationList : MutationRecord[]){
        mutationList.forEach(mutation=>{
            console.log(mutation);
            if(mutation.type === 'childList') {
                mutation.addedNodes.forEach(node=>{
                    //@ts-ignore
                    if(node[MODEL_KEY]){
                        //@ts-ignore
                        if(this.remoteCreateKey[node[MODEL_KEY].key]){
                            //@ts-ignore
                            delete this.remoteCreateKey[node[MODEL_KEY].key]
                        } else {
                            this.insertModel(node);
                        }
                    } else {
                        this.insertModel(node);
                    }
                    
                });
                mutation.removedNodes.forEach(node=>{
                    //@ts-ignore
                    if(node[MODEL_KEY]){
                        //@ts-ignore
                        if(this.remoteRemoveKey[node[MODEL_KEY].key]){
                            //@ts-ignore
                            delete this.remoteRemoveKey[node[MODEL_KEY].key]
                        } else {
                            //@ts-ignore
                            const model = node[MODEL_KEY];
                            const key = model.remove();
                            delete this.mocuMap[key];
                            this.editor.contentsChangeHandlers.forEach(f=>{
                                f({
                                    type : 'remove',
                                    key : key
                                });
                            });
                        }
                    }

                });
            } else if(mutation.type === 'characterData'){
                //@ts-ignore
                const model = mutation.target[MODEL_KEY];
                if(model){
                    if(this.remoteUpdateKey[model.key]){
                        //@ts-ignore
                        delete this.remoteUpdateKey[model.key]
                    } else {
                        const dataModel = model.update(mutation);
                        this.editor.contentsChangeHandlers.forEach(f=>{
                            f(dataModel);
                        });
                    }
    
                }
                // console.log(this.editor.swSelection?.getSelection());
            }
        });
        // console.log(this.getMocument());
    }

    getMocument(){
        const mocu : Model[] = [];
        this.editor.editorEl?.childNodes.forEach(node=>{
            //@ts-ignore
            mocu.push(node[MODEL_KEY]);
        });
        return mocu;
    }

    applyDataModel(dataModel : any){
        this.mutation.disconnect()
        // console.log("applyDataModel",dataModel);
        switch (dataModel.type) {
            case 'create':
                const model = SwRegister.getType(dataModel.tagName).create(dataModel.format.key,dataModel.format);
                this.remoteCreateKey[model.key] = true;
                this.mocuMap[model.key] = model;
                const parentKey = dataModel.format.parentKey;
                if(parentKey){
                    const parent = this.mocuMap[parentKey];
                    if(dataModel.format.previousSibling){
                        parent.appendAtKey(model,dataModel.format.previousSibling,"after",true);
                    } else if(dataModel.format.nextSibling){
                        parent.appendAtKey(model,dataModel.format.nextSibling,"before",true);
                    } else {
                        parent.appendAt(model,0,true);
                    }
                } else {
                    if(dataModel.format.nextSibling){
                        this.editor.editorEl?.insertBefore(model.dom,this.mocuMap[dataModel.format.nextSibling].dom);
                    } else {
                        if(dataModel.format.previousSibling) {
                            if(this.mocuMap[dataModel.format.previousSibling]){
                                if(this.mocuMap[dataModel.format.previousSibling].dom?.nextSibling){
                                    this.editor.editorEl?.insertBefore(model.dom,this.mocuMap[dataModel.format.previousSibling].dom!.nextSibling);
                                } else {
                                    this.editor.editorEl?.appendChild(model.dom);    
                                }
                            }
                        } else {
                            this.editor.editorEl?.appendChild(model.dom);
                        }
                    }
                }
                break;
            case 'remove':
                const removeModel =this.mocuMap[dataModel.key];
                if(removeModel){
                    this.remoteRemoveKey[removeModel.key] = true;
                    removeModel.dom?.parentNode?.removeChild(removeModel.dom);
                    removeModel.remove();
                }
                break;
            case 'update':
                // console.log('update', dataModel.key);
                this.remoteUpdateKey[dataModel.key] = true;
                //@ts-ignore
                this.mocuMap[dataModel.key].setText(dataModel.text);
                break;
        }
        this.mutation.observe(this.editor.editorEl!, OBSERVER_CONFIG);
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
        // console.log(e);
        // const inputType = (e as InputEvent).inputType;
        // e.preventDefault();
        // if(inputType === 'deleteContentBackward'){
        //     this.editor.swSelection?.selection();
        //     // const selection = getSelection();
        //     // console.log(selection!.);
        // } else {
        //     const data = (e as InputEvent).data;
        //     const selection = this.editor.swSelection?.getSelection();
        // }
    }

    beforeInputEventHandler(e:Event){
        const ev = e as InputEvent;
        // const ranges = ev.getTargetRanges();
        // if(ranges.length > 1){
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

}