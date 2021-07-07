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
function canvasInit() {
    console.log("start canvas Init");
    console.log("onload called!");

    // Get a reference to the canvas object
    canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    var drawingProj = paper.setup(canvas);
    paper.project.clear();

    canvasCP = document.getElementById('uiCanvas');
    var uiproject = paper.setup(canvasCP)

    uiproject.activate();
    setupColorPicker();
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