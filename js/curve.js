registerEventHandler("filled",()=>{filled();});
registerEventHandler("notfilled",()=>{notfilled();});

function filled() {
    console.log("filled called");
}
function notfilled() {
    console.log("notfilled called");
}