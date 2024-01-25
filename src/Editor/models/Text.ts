import Model from "./Model";

export default class Text extends Model{
    text : string = '';
    static domType = '#text';

    constructor(key:string,value: string){
        super(key);
        this.text = value;
    }

    static apply(domNode: Node): Model {
        return super.apply(domNode,domNode.textContent);
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

    update(mutation : MutationRecord){
        if(this.dom?.textContent){
            this.text = this.dom?.textContent;
        }
        return {
            type : 'update',
            key : this.key,
            text : this.text
        }
    }

    setText(text : string){
        this.text = text;
        this.dom!.textContent = text;
    }

    format(){
        const format = super.format();
        //@ts-ignore
        format.text = this.text;
        return format;
    }
    

}