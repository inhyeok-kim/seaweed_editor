import SeaweedEditor from "./Editor/Editor";

function createEditor(elem:string | HTMLElement){
    return SeaweedEditor(elem);
}

export default Object.freeze({
    createEditor
});