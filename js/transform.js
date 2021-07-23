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
	moveTool = new Tool();
    moveTool.offsets = [];
	function onMouseDown(event) {
        this.offsets = [];
        for(i = 0; i < paper.project.selectedItems.length; i++) {
            this.offsets[i] = paper.project.selectedItems[i].position.subtract(event.point);
        }
        
	}

	moveTool.onMouseDown = onMouseDown;
    moveTool.onMouseDrag = onMouseDown;
    moveTool.onMouseDrag = function (event) {
        for (i = 0; i < paper.project.selectedItems.length; i++) {
            if (paper.project.selectedItems[i].className != "Layer") {
                paper.project.selectedItems[i].position = this.offsets[i].add( event.point);
            }
        }
	}
	moveTool.activate()
}