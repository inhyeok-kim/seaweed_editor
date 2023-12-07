import SeaweedEditor from "./Editor/SeaweedEditor";

function createEditor(elem:string | HTMLElement){
    return SeaweedEditor(elem);
}

export default Object.freeze({
    createEditor
});