const MODEL_TYPES : {
    [key : string] : any
} = {

}

export default class SwRegister{
    static addType(name:string, model : any){
        MODEL_TYPES[name] = model;
    }
    static find(node : Node){
        try {
            //@ts-ignore
            if(node[MODEL_KEY]){
                //@ts-ignore
                if(typeof node[MODEL_KEY] === 'string'){ // is ROOT
                    return null;
                }
                //@ts-ignore
                const model = node[MODEL_KEY];
                return model;
            }
            return null;
        } catch (error) {
            console.log(node);
            return null;
        }
        
    }
    
    static create(node : Node){
        if(MODEL_TYPES[node.nodeName]){
            const model = MODEL_TYPES[node.nodeName].apply(node);
            return model;
        }
        return null;
    }
}

export const MODEL_KEY : string = '__model';