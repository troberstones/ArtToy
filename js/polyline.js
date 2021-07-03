registerEventHandler("polyline",()=>{
    console.log("Polyline handler");
	if(!polylineTool) {
    	polylineRegister();
	} 
	polylineActivate();
});
var polylineTool = null;

function polylineActivate() {
	polylineTool.activate();
}
function polylineRegister() {
	var path;
	function onMouseDown(event) {
		path = new Path();
		path.strokeColor = 'black';
		path.add(event.point);
	}

	polylineTool = new Tool();
	polylineTool.onMouseDown = onMouseDown;

	polylineTool.onMouseDrag = function (event) {
		path.add(event.point);
	}
	polylineTool.activate();
}