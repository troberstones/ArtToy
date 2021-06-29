// Create a Paper.js Path to draw a line into it:
var path = new Path();
// Give the stroke a color
path.strokeColor = 'black';
var start = new Point(100, 100);
// Move to start and draw a line from there
path.moveTo(start);
// Note the plus operator on Point objects.
// PaperScript does that for us, and much more!
path.lineTo(start + [ 100, -50 ]);

var drawLayer = new Layer();
var uiLayer = new Layer();
uiLayer.activate();
// Create a circle shaped path with its center at the center
// of the view and a radius of 30:
var pathCenterCircle = new Path.Circle({
	center: view.center,
	radius: 30,
	strokeColor: 'black',
	fillColor: 'green'
});

// When the mouse is clicked on the item,
// set its fill color to red:
pathCenterCircle.onMouseDown= function(event) {
    this.fillColor = 'red';
    startDrawing(event);
    return true;
}
var drawCircleCircle = new Path.Circle({
	center: view.center -30,
	radius: 30,
	strokeColor: 'black',
	fillColor: 'blue'
});
uiLayer.activate();
// When the mouse is clicked on the item,
// set its fill color to red:
drawCircleCircle.onMouseUp = function(event) {
    this.fillColor = 'red';
    startCircle(event);
}

function onResize(event) {
	// Whenever the window is resized, recenter the path:
	pathCenterCircle.position = view.center;
    //startDrawing(event);
}
drawLayer.activate();
var path;
function startDrawing(event) {
    // Only execute onMouseDrag when the mouse
    // has moved at least 10 points:
    tool.minDistance = 5;

    tool.onMouseDown = function (event) {
        // Create a new path every time the mouse is clicked
        path = new Path();
        path.add(event.point);
        path.strokeColor = 'black';
        return true;
    }

    tool.onMouseDrag = function (event) {
        // Add a point to the path every time the mouse is dragged
        path.add(event.point);
    }
}

function startCircle(event) {
    // Only execute onMouseDrag when the mouse
    // has moved at least 10 points:
    tool.minDistance = 5;

    tool.onMouseDown = function (event) {
        // Create a new path every time the mouse is clicked
        path = new Path.Circle({
            center: event.point,
            radius: 30,
            strokeColor: 'black',
            fillColor: 'green'
        });
        
        //path.add(event.point);
        //path.strokeColor = 'black';
        return true;
    }

    tool.onMouseDrag = function (event) {
        // Add a point to the path every time the mouse is dragged
        path.position = event.point;
    }

}
function onMouseDown(event) {
    console.log('You pressed the mouse!');
}

function onMouseDrag(event) {
    console.log('You dragged the mouse!');
}

function onMouseUp(event) {
    console.log('You released the mouse!');
}
