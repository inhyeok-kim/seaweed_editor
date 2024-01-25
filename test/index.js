import SeaweedEditor from '../dist/index.js'

const editor2 = SeaweedEditor.createEditor("wrapper2");
const editor = SeaweedEditor.createEditor("wrapper",true);

editor.on("selection_change",(selection)=>{
    // console.log(selection);
})

editor.on("contents_change",(dataModel)=>{
    editor2.pushDataModel(dataModel);
})

document.getElementById('btn').addEventListener('click',()=>{
    const doc = editor.getDocument();
    console.log(doc);
});
document.getElementById('btn2').addEventListener('click',()=>{
    const doc = editor2.getDocument();
    console.log(doc);
});

document.getElementById('bold').addEventListener('click',()=>{
    const doc = editor.setBold();
});

document.getElementById('insert').addEventListener('click',()=>{
    setTimeout(()=>{
        document.querySelector('#wrapper p').textContent = 'hihihi';
    },1000);
});