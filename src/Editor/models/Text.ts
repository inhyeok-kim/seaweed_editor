import Model from "./Model";

export default class Text extends Model{
    text : string = '';
    static domType = '#text';

    constructor(key:string,value: string){
        super(key);
    }

    static apply(domNode: Node): Model {
        return super.apply(domNode);
    }
    
    static create(key: string, text? : string): Text {
        const model = super.create(key,text) as Text;
        if(text){
            model.text = text;
        } else {
            model.text = '\n';
        }
        (model.dom! as HTMLSpanElement).innerText = model.text;

        return model;

    }
    

}