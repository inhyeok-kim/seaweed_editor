import Model from "./Model";

export default class Paragraph extends Model{
    #isContainer = true;
    static domType = 'p';
    
    constructor(key:string, text:string){
        super(key);
    }

}