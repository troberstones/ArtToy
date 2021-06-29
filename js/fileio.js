registerEventHandler("quicksave",()=>{quicksave();});
registerEventHandler("New",()=>{newDocument();});
registerEventHandler("Trash",()=>{closeDocument();});

function closeDocument() {
    console.log("close doc called");
}
function newDocument() {
    console.log("New doc called");
}
function quicksave() {
    console.log("Quicksave called");
}