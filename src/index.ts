import SeaweedEditor from "./Editor/SeaweedEditor";

function createEditor(elem:string | HTMLElement, isNew : boolean){
    return SeaweedEditor(elem, isNew);
}

export default Object.freeze({
    createEditor
});