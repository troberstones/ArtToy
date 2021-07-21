registerEventHandler("filled",()=>{filled();});
registerEventHandler("notfilled",()=>{notfilled();});
registerEventHandler("notstroked",()=>{notstroked();});

function filled() {
	console.log("filled called");
	if (!curveTool) {
		filledRegister();
	}
	filledCurveTool = true;
	strokedCurveTool = true;
	activateCurveTool();
}
function notfilled() {
    console.log("notfilled called");
	if (!curveTool) {
		filledRegister();
	}
	filledCurveTool = false;
	strokedCurveTool = true;
	activateCurveTool();
}
function notstroked() {
    console.log("not stroked called");
	if (!curveTool) {
		filledRegister();
	}
	filledCurveTool = true;
	strokedCurveTool = false;
	activateCurveTool();
}
var curveTool = null;
function activateCurveTool() {
	curveTool.activate();
}

var filledCurveTool = false;
var strokedCurveTool= false;

function filledRegister() {
	var path;

	function onMouseDown(event) {
		path = new Path();

		//path.style = {
		//	fillColor: new Color(1, 0, 0),
		//	strokeColor: 'black',
		//	strokeWidth: 5
		//};

		if(strokedCurveTool) {
			path.strokeColor = 'black';
		}
		if(filledCurveTool) {
			//path.fillColor = "red";
			path.fillColor = fillColor;
		}
		path.add(event.point);
	}

	curveTool= new Tool();
	curveTool.onMouseDown = onMouseDown;

	curveTool.onMouseDrag = function (event) {
		path.add(event.point);
	}
	curveTool.onMouseUp = function (event) {
		path.simplify(1);
		//path.selected = true;
	}
	curveTool.activate()
}
function polylineVersionfilledRegister() {
    console.log("registerCurvetool");
	var path;
	function onMouseDown(event) {
		path = new Path();
		path.strokeColor = 'black';
		path.add(event.point);
	}

	curveTool = new Tool();
	curveTool.minDistance = 30;
	curveTool.onMouseDown = onMouseDown;

	curveTool.onMouseDrag = function (event) {
			// Use the arcTo command to draw cloudy lines
			//path.arcTo(event.point);
            path.add(event.point);
		}
}