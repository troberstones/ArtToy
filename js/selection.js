registerEventHandler("select",()=>{
    console.log("select handler");
	if(!selectTool) {
    	selectToolRegister();
	} 
    selectToolEyedropperMode = false;
    selectToolPointsMode = false;
	selectToolActivate();
});
registerEventHandler("selectpoints",()=>{
    console.log("selct points handler");
	if(!selectTool) {
    	selectToolRegister();
	} 
    selectToolEyedropperMode = false;
    selectToolPointsMode = true;
	selectToolActivate();
});

registerEventHandler("eyedropper",()=>{
    console.log("selct points handler");
	if(!selectTool) {
    	selectToolRegister();
	} 
    selectToolPointsMode = false;
    selectToolEyedropperMode = true;
    lastTool = tool;
	selectToolActivate();
});

var selectTool = null;
var selectToolPointsMode = false;
var selectToolEyedropperMode = false;
var lastTool = null;
function selectToolActivate() {
	selectTool.activate();
}
function selectToolRegister() {
	var path;
	function onMouseDown(event) {
		//path = new Path();
		//path.strokeColor = 'black';
		//path.add(event.point);
        options = {
            fill: true, 
            stroke: true,
            layer: false
        }
        sel = null;
        sel = paper.project.hitTest(event.point,options);
        if(selectToolEyedropperMode) {
            if(sel) {
                fillColor = sel.item.fillColor;
            }
            lastTool.activate();
        } else {
            if (sel) {
                sel.item.selected = true;
            } else {
                paper.project.deselectAll();
                //paper.project.selectedItems.foreach((itm)=>{itm.selected = false;});
            }
        }
	}

	selectTool = new Tool();
	selectTool.onMouseDown = onMouseDown;

	//selectTool.onMouseDrag = function (event) {
	//	//path.add(event.point);
	//}
	selectTool.activate()
}