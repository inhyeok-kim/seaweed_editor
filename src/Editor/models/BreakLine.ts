import Model from "./Model";

export default class BreakLine extends Model{
    static isContainer = false;
    static domType = 'br';
    
    constructor(key:string){
        super(key);
    }

}