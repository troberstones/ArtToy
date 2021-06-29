registerEventHandler("undo",()=>{undo();});
registerEventHandler("redo",()=>{redo();});

function undo() {
    console.log("undo called");
}
function redo() {
    console.log("redo called");
}