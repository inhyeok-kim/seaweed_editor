export default function PageComponent(){
    
    const editorWrapper = document.createElement("div");

    editorWrapper.setAttribute("contenteditable","true");

    return editorWrapper;
}