window.onload = function () {
    //uiInit();
    canvasInit();
    //paletteInit();
    //init_range_sliders();
}
var canvas;


function canvasInit() {
    console.log("start canvas Init");
    console.log("onload called!");

    // Get a reference to the canvas object
    canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    paper.project.clear();
    paper.project.importSVG("artmachineIcons.svg");
    //let savedDrawing = localStorage.getItem("drawing");
    //if (savedDrawing) {
    //    paper.project.clear();
    //    paper.project.importJSON(savedDrawing);
    //}
    let canvasParent = canvas.parentElement;
    canvas.width = canvasParent.offsetWidth;
    canvas.height = canvasParent.offsetHeight;

    //window.addEventListener("resize", (event) => {
    //    canvas.width = canvasParent.offsetWidth;
    //    canvas.height = canvasParent.offsetHeight;
    //});
    //window.addEventListener("beforeunload", (event) => {
    //    localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));
    //});
    //window.addEventListener("visibilitychange", function (e) {
    //    if (document.visibilityState == 'hidden') {
    //        localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));
    //    }
    //});
}