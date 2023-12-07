export default class KeyDownManger {
    private keyDownMap : {[index : string] : boolean} = {}
    private keyDownCnt : number = 0
    
    keyDown(code : string){
        this.keyDownMap[code] = true;
        this.keyDownCnt++;
    }

    keyUp(code : string){
        this.keyDownMap[code] = false;
        this.keyDownCnt--;
    }

    isOnly(codes : string[]){
        if(this.keyDownCnt === codes.length) {
            for(let i=0; i<codes.length;i++){
                if(!this.keyDownMap[codes[i]]){
                    return false
                }
            }
            return true;
        }

        return false;
    }

    isInclude(codes : string[]){
        for(let i=0; i<codes.length;i++){
            if(!this.keyDownMap[codes[i]]){
                return false;
            }
        }
        return true;
    }

}