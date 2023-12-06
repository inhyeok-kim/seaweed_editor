import * as ComponentBuilder from "./Component/ComponentBuilder";
import Writer from "./Writer";

export class SeaweedEditor {
    rootEl : HTMLElement | null = null;
    pageComp : HTMLElement | null = null;
    writer : Writer | null = null;
    constructor(elem : string | HTMLElement){
        let rootEl;

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
        this.rootEl = rootEl;
        this.pageComp = ComponentBuilder.createPageComponent();
        this.rootEl.appendChild(this.pageComp);
        this.writer = new Writer(this);
    }
}

export default function createEditor(elem:string | HTMLElement){
    return new SeaweedEditor(elem);
};