registerEventHandler("move",()=>{
    console.log("move handler");
	if(!moveTool) {
    	moveToolRegister();
	} 
    moveToolMode = "xform";
	moveToolActivate();
});
registerEventHandler("rotate",()=>{
    console.log("rotate handler");
	if(!moveTool) {
    	moveToolRegister();
	} 
    moveToolMode = "rotate";
	moveToolActivate();
});
registerEventHandler("scale",()=>{
    console.log("scale handler");
	if(!moveTool) {
    	moveToolRegister();
	} 
    moveToolMode = "scale";
	moveToolActivate();
});

var moveTool = null;
var moveToolMode = "xform";

function moveToolActivate() {
	moveTool.activate();
}
function moveToolRegister() {
	var path;
	function onMouseDown(event) {
        //(paper.project.selectedItems).foreach((itm) => { itm.position= event.pos; });
        //for(i = 0; i < paper.project.selectedItems.length; i++) {
        //    if(paper.project.selectedItems[i].className != "Layer") {
        //    paper.project.selectedItems[i].position = event.point;
        //    }
        //}
        
	}

	moveTool = new Tool();
	moveTool.onMouseDown = onMouseDown;
    moveTool.onMouseDrag = onMouseDown;
    moveTool.onMouseDrag = function (event) {
        for (i = 0; i < paper.project.selectedItems.length; i++) {
            if (paper.project.selectedItems[i].className != "Layer") {
                paper.project.selectedItems[i].position += event.delta;
            }
        }
	}
	moveTool.activate()
}