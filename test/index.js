import SeaweedEditor from '../dist/index.js'

const editor = SeaweedEditor.createEditor("wrapper");

editor.on("selection_change",(selection)=>{
    console.log(selection);
})