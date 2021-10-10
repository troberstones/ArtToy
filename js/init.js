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

}
function processs_touchcanel(ev) {
    console.log("touchcancel");

}
function processs_touchend(ev) {
    console.log("touchend");

}
// touchstart handler
function process_touchstart(ev) {
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
function handle_two_touches(ev) {
    console.log("one two touches");
    return false;
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