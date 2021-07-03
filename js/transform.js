registerEventHandler("move",()=>{translate();});
registerEventHandler("rotate",()=>{rotate();});
registerEventHandler("scale",()=>{scale();});




function translate() {
    console.log("translate selection called");
}
function rotate() {
    console.log("rotate sel called");
}
function scale() {
    console.log("scale selection called");
}