//window.onload = function () {
    ////uiInit();
    //canvasInit();
    ////paletteInit();
    ////init_range_sliders();
//}
paper.install(window);
// Keep global references to both tools, so the HTML
// links below can access them.

var canvas;
var canvasCP;

//function drawBox() {
//    paper.project.
//}
function initCanvasTouchEvent(someElement) {
    // Register touch event handlers
    someElement.addEventListener('touchstart', process_touchstart, false);
    someElement.addEventListener('touchmove', processs_touchmove, false);
    someElement.addEventListener('touchcancel', processs_touchcanel, false);
    someElement.addEventListener('touchend', processs_touchend, false);
}
function processs_touchmove(ev) {
    console.log("touchmove");
    handle_pinch_zoom(ev);
}

function processs_touchcanel(ev) {
    console.log("touchcancel");
    touchCount = ev.touches.length;
    pinching = false;
    panning = false;
}

function processs_touchend(ev) {
    console.log("touchend");
    touchCount = ev.touches.length;
    pinching = false;
    panning = false;
}
// touchstart handler
function process_touchstart(ev) {
    touchCount = ev.targetTouches.length;
    // Use the event's data to call out to the appropriate gesture handlers
    switch (ev.touches.length) {
        case 1: handle_one_touch(ev); break;
        case 2: handle_two_touches(ev); break;
       // case 3: handle_three_touches(ev); break;
        default: gesture_not_supported(ev); break;
    }
}
function handle_one_touch(ev) {
    console.log("one touch");
    return false;
}
var tpCache = new Array();
var touchCount = 0;
var distanceBetweenTouches = null;
var pinching = false;
var panning = false;
var pzstartPoint = null;
var pzstartPoint2 = null;
var pzstartMatrixPt = null;
var StartVector = null;
var StartVectorOrig = null;
var StartMatrix = null;
var tan = null;
var bitan = null;
var testVector = null;
var testCircle = null;
var tpt0 = null;
var tpt1 = null;
var tvec0 = null;
var _startPoint = null;
var _startMatrixPt= null;
function handle_two_touches(ev) {
    console.log("two touches");

    //for (var i = 0; i < ev.targetTouches.length; i++) {
    // tpCache.push(ev.targetTouches[0]);
    // tpCache.push(ev.targetTouches[1]);
    //}
    let pt0 = new Point(ev.targetTouches[0].clientX,ev.targetTouches[0].clientY);
    let pt1 = new Point(ev.targetTouches[1].clientX,ev.targetTouches[1].clientY);

    _startPoint = view.projectToView(pt0);
    _startMatrixPt = new Point(view.matrix.tx,view.matrix.ty);

   tpt0 = pt0;
    tpt1 = pt1;
    tvec0 = pt0.subtract(pt1);
    pzstartPoint = view.getEventPoint(ev.targetTouches[0]);
    pzstartPoint2 = view.getEventPoint(ev.targetTouches[1]);
    //console.log(pzstartPoint,pzstartPoint2);
    pzstartMatrixPt = new Point(view.matrix.tx, view.matrix.ty);
    StartVectorOrig = pzstartPoint.subtract(pzstartPoint2);
    StartVector = StartVectorOrig.normalize();
    //tan = StartVector;
    //bitan = new Point(-StartVector.y,StartVector.x);
    // tan = StartVector.cross(ref);
    // bitan = StartVector.cross(tan); 
    StartMatrix = view.matrix; 
    distanceBetweenTouches = pzstartPoint.getDistance(pzstartPoint2);
    //console.log(`Initial Distance ${distanceBetweenTouches}`);
    testCircle = new Path.Circle(pzstartPoint,20);
    testCircle.fill = "green";
    return false;
}
function handle_pinch_zoom(ev) {
    //console.log(`Changed touches = ${ev.changedTouches.length}`);
    //if (ev.targetTouches.length == 2 && ev.changedTouches.length == 2) {
    if (touchCount == 2) {
        // Check if the two target touches are the same ones that started
        // the 2-touch
        let point1 = -1, point2 = -1;
        // for (var i = 0; i < tpCache.length; i++) {
        //     if (tpCache[i].identifier == ev.targetTouches[0].identifier) point1 = i;
        //     if (tpCache[i].identifier == ev.targetTouches[1].identifier) point2 = i;
        // }
        point1 = 1; 
        point2 = 1;
        if (point1 >= 0 && point2 >= 0) {
            // Calculate the difference between the start and move coordinates
            let pt0 = new Point(ev.targetTouches[0].clientX, ev.targetTouches[0].clientY);
            let pt1 = new Point(ev.targetTouches[1].clientX, ev.targetTouches[1].clientY);
            let curStartPoint = view.getEventPoint(ev.targetTouches[0]);
            let curStartPoint2 = view.getEventPoint(ev.targetTouches[1]);
            let touchDistancDiff = distanceBetweenTouches - curStartPoint.getDistance(curStartPoint2);

            let CurVectora = curStartPoint.subtract(curStartPoint2);

            let CurVectorNormalized = CurVectora.normalize();
            //let rotAngle = CurVectorNormalized.getDirectedAngle(StartVector);
            let curvec = pt0.subtract(pt1);
            let rotAngle = tvec0.getDirectedAngle(curvec);
            StartVector = CurVectorNormalized;
            let pt1Movement = pt0.getDistance(tpt0,false);
            let pt2Movement = pt1.getDistance(tpt1,false);

            tpt0 = pt0;
            tpt1 = pt1;
            tvec0 = curvec; 
            //let xfmat = new Matrix(row1.x, row1.y,row2.x,row2.y,0,0);
            //if (Math.abs(touchDistancDiff) > 5) {
                //view.matrix = StartMatrix;
                //view.matrix.append(xfmat);
                
            let ptDelta = view.projectToView(pt0).subtract(_startPoint);
            //view.matrix.tx = _startMatrixPt.x - ptDelta.x;
            //view.matrix.ty = _startMatrixPt.y - ptDelta.y;
            view.matrix.translate(ptDelta);

                if(pt1Movement < pt2Movement) {
                    let pt1MovementVs = view.projectToView(tpt0).subtract(view.projectToView(pt0));
                    view.matrix.rotate(rotAngle, curStartPoint);
                    //view.matrix.translate(pt1MovementVs);
                } else {
                    let pt1MovementVs = view.projectToView(tpt1).subtract(view.projectToView(pt1));

                    view.matrix.rotate(rotAngle, curStartPoint2);
                    //view.matrix.translate(pt1MovementVs);
                }
            pzstartPoint = curStartPoint;
            pzstartPoint2 = curStartPoint2;
            
            //let ptDelta = _startPoint.subtract(view.projectToView(pt0));



            _startPoint = view.projectToView(pt0);
            _startMatrixPt = new Point(view.matrix.tx, view.matrix.ty);
            
                pinching = true;
            //}
            testCircle.position = view.getEventPoint(ev.targetTouches[0]);
            // if (pinching) {
            //     view.matrix.scale(1+touchDistancDiff*-.0001,pzstartPoint);
            //     if(touchDistancDiff > 1) {
            //     console.log(`zoom in ${touchDistancDiff}`);
            //     } 
            //     if(touchDistancDiff < 0) {
            //     console.log(`zoom out ${touchDistancDiff}`);
            //     } 
            // }
            
        
        }
    }
}
function resetPointPositions(ev) {
    // Try working with deltas instead of abs result
    let pt0 = new Point(ev.targetTouches[0].clientX, ev.targetTouches[0].clientY);
    let pt1 = new Point(ev.targetTouches[1].clientX, ev.targetTouches[1].clientY);
    pzstartPoint = view.getEventPoint(ev.targetTouches[0]);
    pzstartPoint2 = view.getEventPoint(ev.targetTouches[1]);
    console.log(pzstartPoint, pzstartPoint2);
    pzstartMatrixPt = new Point(view.matrix.tx, view.matrix.ty);
    distanceBetweenTouches = pt0.getDistance(pt1);
}
function canvasInit() {
    console.log("start canvas Init");
    console.log("onload called!");

    // Get a reference to the canvas object
    canvas = document.getElementById('myCanvas');
    // TODO: move this to the better place
    initCanvasTouchEvent(canvas); 
    // Create an empty project and a view for the canvas:
    var drawingProj = paper.setup(canvas);
    paper.project.clear();

    //canvasCP = document.getElementById('uiCanvas');
    //var uiproject = paper.setup(canvasCP)

    //uiproject.activate();
    //setupColorPicker();
    //var testPath = new Path.Circle({center:[10,10],radius:500});
    //testPath.fillColor = "blue";
    //console.log(paper);
    drawingProj.activate();

    //paper.project.importSVG("artmachineIcons.svg");
    let savedDrawing = localStorage.getItem("drawing");
    if (savedDrawing) {
        paper.project.clear();
        paper.project.importJSON(savedDrawing);
    }
    //let canvasParent = canvas.parentElement;
    //canvas.width = canvasParent.offsetWidth;
    //canvas.height = canvasParent.offsetHeight;

    //window.addEventListener("resize", (event) => {
    //    canvas.width = canvasParent.offsetWidth;
    //    canvas.height = canvasParent.offsetHeight;
    //});
    window.addEventListener("beforeunload", (event) => {
        localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));
    });
    window.addEventListener("visibilitychange", function (e) {
        if (document.visibilityState == 'hidden') {
            localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));
        }
    });
}

function setupColorPicker() {
    for(let i = 0; i < 10; i++) {
        var colorCircle = new Path.Circle({center:[i*10,30],radius:10});
        colorCircle.fillColor = "red";
    }
}

function colorSlider(mode, value) {
    //console.log("ColorSlider:" + mode + " " + value);
    color = getColorComponents(fillColor);

    switch (mode) {
        case "r":
            color[0] = value;
            fillColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "g":
            color[1] = value;
            fillColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "b":
            color[2] = value;
            fillColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "h":
            hsvColor = rgb2hsv(color[0] / 255, color[1] / 255, color[2] / 255);
            hsvColor[0] = value;
            color = hsv2rgb(...hsvColor)
            fillColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            break;
        case "s":
            hsvColor = rgb2hsv(color[0] / 255, color[1] / 255, color[2] / 255);
            hsvColor[1] = value / 255;
            color = hsv2rgb(...hsvColor)
            fillColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            break;
        case "v":
            hsvColor = rgb2hsv(color[0] / 255, color[1] / 255, color[2] / 255);
            hsvColor[2] = value / 255;
            color = hsv2rgb(...hsvColor)
            fillColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            break;
        default:
            break;
    }
    colorChanged();
    drawSwatch(null);
}
function colorChanged() {
    updateColorSliders();
    applyCurrentColorToSelection();
   // if (activeItem) {
   //     activeItem.fillColor = fillColor;
   // } else {
   //     if (adjustLastColor == true) {
   //         paper.project.activeLayer.lastChild.fillColor = fillColor;
   //         //paper.view.draw();
   //     }
   // }
}
function applyCurrentColorToSelection() {
    for(i = 0; i < paper.project.selectedItems.length; i++) {
        if (paper.project.selectedItems[i].className != "Layer") {
            paper.project.selectedItems[i].fillColor = fillColor;
        }
    }
}
function clearSelection() {
    paper.project.deselectAll();
}