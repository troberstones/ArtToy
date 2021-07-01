registerEventHandler("polyline",()=>{
    console.log("Polyline handler");
    polylineRegister();

});
var polylineTool = null;
function polylineRegister() {
    if(polylineTool) {
        polylineTool.activate();
      return;  
    } 
    var path;
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}

		polylineTool= new Tool();
		polylineTool.onMouseDown = onMouseDown;

		polylineTool.onMouseDrag = function(event) {
			path.add(event.point);
		}

		//tool2 = new Tool();
		//tool2.minDistance = 20;
		//tool2.onMouseDown = onMouseDown;

		//tool2.onMouseDrag = function(event) {
		//	// Use the arcTo command to draw cloudy lines
		//	path.arcTo(event.point);
		//}
}