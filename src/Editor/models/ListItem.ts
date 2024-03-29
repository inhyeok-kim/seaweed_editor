import Model from "./Model";

export default class ListItem extends Model{
    static isContainer = true;
    static domType = 'LI';
    
    constructor(key:string){
        super(key);
    }

    static apply(domNode: Node): Model {
        return super.apply(domNode);
    }

}