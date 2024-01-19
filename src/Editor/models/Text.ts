import Model from "./Model";

export default class Text extends Model{
    text : string = ''

    constructor(key:string, text:string){
        super(key);
        this.text = text;
    }

}