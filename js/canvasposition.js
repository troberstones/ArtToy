registerEventHandler("pan",()=>{pan();});
registerEventHandler("zoom",()=>{zoom();});

function pan() {
    console.log("pan doc called");
    pantoolregister()
}
function zoom() {
    console.log("zoom doc called");
    zoomToolRegister()
}

var pantool = null;
var zoomtool = null;

var startPoint;
var startMatrixPt;

function zoomToolRegister() {
    if(zoomtool) {
        zoomtool.activate();
      return;  
    } 
		function onMouseDown(event) {
            //startPoint = view.projectToView(event.point);
            startPoint = event.point;
            startMatrixPt = new Point(view.matrix.tx,view.matrix.ty);
			//var shape = new Shape.Circle(event.point, 30);
			//shape.strokeColor = 'black';
		}

		zoomtool = new Tool();
		zoomtool.onMouseDown = onMouseDown;

		zoomtool.onMouseDrag = function(event) {
            var ptDelta = startPoint.subtract(event.point);
            //view.matrix.tx = startMatrixPt.x - ptDelta.x;
            //view.matrix.ty = startMatrixPt.y - ptDelta.y;
			view.matrix.scale(1+ptDelta.y*.00025,startPoint);
		}
    zoomtool.activate();
}

function pantoolregister() {
    if(pantool) {
        pantool.activate();
      return;  
    } 
		function onMouseDown(event) {
            startPoint= view.projectToView(event.point);
            startMatrixPt = new Point(view.matrix.tx,view.matrix.ty);
		}

		pantool = new Tool();
		pantool.onMouseDown = onMouseDown;

		pantool.onMouseDrag = function(event) {
            var ptDelta = startPoint.subtract(view.projectToView(event.point));
            view.matrix.tx = startMatrixPt.x - ptDelta.x;
            view.matrix.ty = startMatrixPt.y - ptDelta.y;
		}
    pantool.activate();
		//tool2 = new Tool();
		//tool2.minDistance = 20;
		//tool2.onMouseDown = onMouseDown;

		//tool2.onMouseDrag = function(event) {
		//	// Use the arcTo command to draw cloudy lines
		//	path.arcTo(event.point);
		//}
}