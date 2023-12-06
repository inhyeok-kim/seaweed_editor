export default function TextBlock(){
    const textBlock = document.createElement("div");
    textBlock.style.minHeight = "25px";
    textBlock.appendChild(document.createElement("br"));


    
    return textBlock;
}