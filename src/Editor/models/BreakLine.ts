import Model from "./Model";

export default class BreakLine extends Model{
    static isContainer = false;
    static domType = 'BR';
    
    constructor(key:string){
        super(key);
    }

}