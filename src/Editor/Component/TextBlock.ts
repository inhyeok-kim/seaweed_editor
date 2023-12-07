export default function TextBlock(id? : string){
    const textBlock = document.createElement("div");
    textBlock.style.minHeight = "25px";
    textBlock.dataset.id = id;
    textBlock.appendChild(document.createElement("br"));


    
    return textBlock;
}