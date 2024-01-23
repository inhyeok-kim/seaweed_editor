export default class ChangeEvent{
    key : string;
    eventType :EventType;
    data : string;
    index : number
    constructor(key : string, type : EventType, data : string, index : number){
        this.key=key;
        this.eventType = type;
        this.data = data;
        this.index = index;
    }
}

type EventType = 'insert'|'create'|'update'|'delete'; 