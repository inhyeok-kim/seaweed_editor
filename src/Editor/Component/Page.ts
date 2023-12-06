export default function Page(){
    
    const editorWrapper = document.createElement("div");
    editorWrapper.setAttribute("contenteditable","true");

    return editorWrapper;
}