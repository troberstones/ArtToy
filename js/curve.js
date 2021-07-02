registerEventHandler("filled",()=>{filled();});
registerEventHandler("notfilled",()=>{notfilled();});

function filled() {
    console.log("filled called");
    filledRegister();
}
function notfilled() {
    console.log("notfilled called");
}

var curveTool = null;
function filledRegister() {
    console.log("registerCurvetool");
    if(curveTool) {
        curveTool.activate();
      return;  
    } 
    var path;
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}

		curveTool = new Tool();
		curveTool.minDistance = 30;
		curveTool.onMouseDown = onMouseDown;

		curveTool.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			//path.arcTo(event.point);
            path.add(event.point);
		}
}