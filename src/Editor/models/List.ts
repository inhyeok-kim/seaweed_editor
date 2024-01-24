import Model from "./Model";

export default class List extends Model{
    static isContainer = true;
    static domType = 'ul';
    
    constructor(key:string){
        super(key);
    }

    static apply(domNode: Node): Model {
        return super.apply(domNode);
    }

}