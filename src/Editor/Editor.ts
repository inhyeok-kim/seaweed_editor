import * as ElementFactory from "./Elements/ElementFactory";

export class SwaweedEditor {
    rootEl : HTMLElement | null = null;
    
    constructor(elem : string | HTMLElement){
        let rootEl
        if(typeof elem == "string"){
            rootEl = document.getElementById(elem);
        } else if(elem instanceof HTMLElement){
            rootEl = elem;
        } else {
            console.error("제공된 인자는 id 또는 HTMLElement여야 합니다.");
            return;
        }

        if(!rootEl){
            console.error("에디터 생성에 실패하였습니다. 제공된 인자를 확인해주세요.");
            return;
        }

        this.rootEl = rootEl

    }
}

export default function SeaweedEditor(elem:string | HTMLElement){
    return new SwaweedEditor(elem);
};