export default function EditorWrapper(){
    
    const editorWrapper = document.createElement("div");

    editorWrapper.setAttribute("contenteditable","true");

    return editorWrapper;
}