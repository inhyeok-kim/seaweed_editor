import Model from "./Model";

export default class Paragraph extends Model{
    static isContainer = true;
    static domType = 'P';
    
    constructor(key:string, text:string){
        super(key);
    }

}