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
    
    static create(key: string, format? : any): Text {
        const model = super.create(key,format.text) as Text;
        if(format.text){
            model.text = format.text;
        } else {
            model.text = '\n';
        }
        (model.dom! as HTMLSpanElement).textContent = model.text;

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