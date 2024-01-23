import Model from "./Model";

export default class List extends Model{
    static isContainer = true;
    static domType = 'ul';
    
    constructor(key:string, text:string){
        super(key);
    }

}