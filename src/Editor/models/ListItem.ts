import Model from "./Model";

export default class ListItem extends Model{
    static isContainer = true;
    static domType = 'li';
    
    constructor(key:string, text:string){
        super(key);
    }

}