registerEventHandler("pan",()=>{pan();});

function pan() {
    console.log("pan doc called");
    pantoolregister()
}

registerEventHandler("polyline",()=>{
    console.log("Polyline handler");
    polylineRegister();

});
var pantool = null;
var panStartPoint;
var startMatrixPt;
function pantoolregister() {
    if(pantool) {
        pantool.activate();
      return;  
    } 
		function onMouseDown(event) {
            panStartPoint= view.projectToView(event.point);
            startMatrixPt = new Point(view.matrix.tx,view.matrix.ty);
		}

		pantool = new Tool();
		pantool.onMouseDown = onMouseDown;

		pantool.onMouseDrag = function(event) {
            var ptDelta = panStartPoint.subtract(view.projectToView(event.point));
            view.matrix.tx = startMatrixPt.x - ptDelta.x;
            view.matrix.ty = startMatrixPt.y - ptDelta.y;
		}

		//tool2 = new Tool();
		//tool2.minDistance = 20;
		//tool2.onMouseDown = onMouseDown;

		//tool2.onMouseDrag = function(event) {
		//	// Use the arcTo command to draw cloudy lines
		//	path.arcTo(event.point);
		//}
}