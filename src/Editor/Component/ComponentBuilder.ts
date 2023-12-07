import Page from "./Page";
import TextBlock from "./TextBlock";

export function createPage(){
    return Page();
}
export function createTextBlock(id?:string){
    return TextBlock(id? id : crypto.randomUUID());
}