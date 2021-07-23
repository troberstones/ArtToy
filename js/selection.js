registerEventHandler("select",()=>{
    console.log("select handler");
	if(!selectTool) {
    	selectToolRegister();
	} 
    selectToolPointsMode = false;
	selectToolActivate();
});
registerEventHandler("selectpoints",()=>{
    console.log("selct points handler");
	if(!selectTool) {
    	selectToolRegister();
	} 
    selectToolPointsMode = true;
	selectToolActivate();
});



var selectTool = null;
var selectToolPointsMode = false;
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
        if(sel) {
            sel.item.selected = true;
        } else {
            paper.project.deselectAll();
            //paper.project.selectedItems.foreach((itm)=>{itm.selected = false;});
        }
	}

	selectTool = new Tool();
	selectTool.onMouseDown = onMouseDown;

	//selectTool.onMouseDrag = function (event) {
	//	//path.add(event.point);
	//}
	selectTool.activate()
}