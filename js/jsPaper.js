
window.onload = function () {
    uiInit();
    canvasInit();
    paletteInit();
    init_range_sliders();
}
var canvas;


function canvasInit() {
    console.log("start canvas Init");
    console.log("onload called!");

    // Get a reference to the canvas object
    canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    let savedDrawing = localStorage.getItem("drawing");
    if (savedDrawing) {
        paper.project.clear();
        paper.project.importJSON(savedDrawing);
    }
    let canvasParent = canvas.parentElement;
    canvas.width = canvasParent.offsetWidth;
    canvas.height = canvasParent.offsetHeight;

    window.addEventListener("resize", (event) => {
        canvas.width = canvasParent.offsetWidth;
        canvas.height = canvasParent.offsetHeight;
    });
    window.addEventListener("beforeunload", (event) => {
        localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));
    });
    window.addEventListener("visibilitychange", function (e) {
        if (document.visibilityState == 'hidden') {
            localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));
        }
    });
    if (window.PointerEvent) {
        canvas.addEventListener("pointermove", pointermove);
        canvas.addEventListener("pointerdown", touchdown);
        canvas.addEventListener("pointerup", touchup);
    }
    // Create a Paper.js Path to draw a line into it:
    //var path = new paper.Path();
    // Give the stroke a color
    //path.strokeColor = 'black';
    //var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    //path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    //path.lineTo(start.add([200, -50]));
    // Draw the view now:
    //paper.view.draw();
}
function touchup(event) {
    switch (mode) {
        case "polyfill":
            if (currentFilledShape) {
                endFilledShape();
                //currentFilledShape.simplify();
                //paper.view.draw();
                //currentFilledShape = false;
            }
            break;
    }
}
function touchdown(event) {
    if (mode != "select") {
        deselect();
    }
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "circle":
            drawCircle(event);
            break;
        case "stroke":
            line(event, "stroke")
            break;
        case "polyfill":
            filledShape(event);
            break;
        case "polygon":
            filledShape(event);
            break;
        case "select":
            clickHandler(event);
            break;
        case "selectRect":
            clickHandler(event);
            break;
        case "picker":
            clickHandler(event)
            break;
        case "line":
            line(event, "segment");
            break;
        case "rect":
            line(event, "rect");
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }

}
function printMessage(message) {
    document.getElementById("brushSizeIndicator").innerHTML = message;
}

function pointermove(event) {
    printMessage(mode);
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "circle":
            drawCircle(event);
            break;
        case "polyfill":
            filledShape(event);
            break;
        case "polygon":
            filledShape(event);
            break;
        case "picker":
            //clickHandler(event)
            break;
        case "select":
            printMessage("Buttons:" + event.buttons);
            // Move the selected item
            if (activeItem && event.buttons != 0) {
                var pos = getCursorPosition(event);
                if (hitItem.type == "segment") {
                    activeItem.point = new paper.Point(pos.x - hitDelta.x, pos.y - hitDelta.y);
                } else {
                    activeItem.position = new paper.Point(pos.x - hitDelta.x, pos.y - hitDelta.y);
                }
            }
            break;
        case "selectRect":
            if (startCorner != null || event.buttons != 0) {
                selectRect(event, null);
                printMessage("Buttons:" + event.buttons);
            }
            //if (activeItem && event.buttons != 0) {
            //    var pos = getCursorPosition(event);
            //    activeItem.position = new paper.Point(pos.x-hitDelta.x, pos.y-hitDelta.y);
            //}
            break;
        case "line":
            line(event, "segment")
            break;
        case "rect":
            line(event, "rect")
            break;
        case "stroke":
            line(event, "stroke")
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }
}

function clickHandler(e) {
    console.log("clicked!");
    switch (mode) {
        case "select":
            console.log("select started!");
            selectItem(e, false);
            break;
        case "selectRect":
            console.log("select points started!");
            selectRect(e, false);
            break;
        case "picker":
            setColor(e, false);
            revertMode();
            break;
        case "polygon":
            console.log("polygon");
            polygon(e);

            break;
        case "bezier":
            console.log("bezier");
            bezier(e);
            break;
        default:
            break;
    }
}
// Configure it so that the selectionmask is changes by the UI
var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};
// Select some item on the canvas and set it to the active item
var activeItem = null;
var hitItem = null;
function deselect() {
    if (activeItem) {
        activeItem.selected = false;
        activeItem = null;
    }
}
var hitDelta = null;
function selectItem(event, someBool) {
    var pos = getCursorPosition(event);
    let hitPos = new paper.Point(pos.x, pos.y)

    hitItem = paper.project.hitTest(hitPos, hitOptions);
    console.log("Hit type:" + hitItem.type);
    deselect();
    if (hitItem) {
        console.log("Selected item!");
        if (hitItem.type == "segment") {
            activeItem = hitItem.segment;
        } else {
            activeItem = hitItem.item;
        }
        hitDelta = hitPos;
        if (hitItem.type == "segment") {
            hitDelta.x -= activeItem.point._x;
            hitDelta.y -= activeItem.point._y;
        } else {
            hitDelta.x -= activeItem.position._x;
            hitDelta.y -= activeItem.position._y;
        }

        activeItem.selected = true;
    }
}
var startCorner = null;
var endCorner = null;
var selectRectangle = null;
var selectedItems = null;
function selectRect(event, someBool) {
    switch (event.type) {
        case "pointermove":
            if (event.buttons == 0) {
                //
                selectedItems = paper.project.getItems({
                    recursive: false,
                    inside: selectRectangle,
                    class: Point
                });
                // Change the fill color of the matched items:
                for (var i = 0; i < selectedItems.length; i++) {
                    selectedItems[i].selected = 'true';
                }
                // end of interaction
                selectRectangle = null;
                startCorner = null;
                endCorner = null;
            } else {
                var pos = getCursorPosition(event);
                if (startCorner == null) {
                    if (selectedItems) {
                        for (var i = 0; i < selectedItems.length; i++) {
                            selectedItems[i].selected = 'false';
                        }
                        selectedItems = null;
                    }
                    startCorner = new paper.Point(pos.x, pos.y)
                    endCorner = new paper.Point(pos.x + 1, pos.y + 1);
                    selectRectangle = new paper.Path.Rectangle({
                        rectangle: {
                            topLeft: startCorner,
                            bottomRight: endCorner
                        },
                        strokeColor: 'black'
                    });
                    selectRectangle.fillColor = '#e9e9ff';
                    selectRectangle.selected = true;

                } else {
                    //endCorner = new paper.Point(pos.x, pos.y)
                    endCorner.x = pos.x;
                    endCorner.y = pos.y;
                    if (selectRectangle) {
                        selectRectangle = new paper.Path.Rectangle({
                            rectangle: {
                                topLeft: startCorner,
                                bottomRight: endCorner
                            },
                            strokeColor: 'black'
                        });
                        //paper.view.draw();
                    } else {
                        selectRectangle = new paper.Path.Rectangle({
                            rectangle: {
                                topLeft: startCorner,
                                bottomRight: endCorner
                            },
                            strokeColor: 'black'
                        });
                        selectRectangle.fillColor = '#e9e9ff';
                        selectRectangle.selected = true;
                    }
                }
            }
            break;
        default:
            break;
    }

}

function colorChanged() {
    updateColorSliders();
    if (activeItem) {
        activeItem.fillColor = fillColor;
    } else {
        if (adjustLastColor == true) {
            paper.project.activeLayer.lastChild.fillColor = fillColor;
            //paper.view.draw();
        }
    }
}
function removeLastItem() {
    let target = paper.project.activeLayer.lastChild;
    target.remove();
    //paper.view.draw();
}
var currentCircle = false;
function drawCircle(event) {
    switch (event.type) {
        case "pointermove":
            if (event.buttons == 0) {
                currentCircle = false;
            }
            if (currentCircle) {
                var pos = getCursorPosition(event);
                currentCircle.position = new paper.Point(pos.x, pos.y);
                //paper.view.draw();
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            currentCircle = new paper.Path.Circle(new paper.Point(pos.x, pos.y), 50);
            currentCircle.fillColor = fillColor;
            currentCircle.blendMode = blendMode;
            break;
        default:
            console.log("circle called for " + event.type);
            break;

    }
}

var currentFilledShape = false;
function filledShape(event) {
    switch (event.type) {
        case "pointermove":
            if (currentFilledShape) {
                if (event.buttons == 0) {
                    console.log("buttons 0 pointer move")
                } else {
                    var pos = getCursorPosition(event);
                    currentFilledShape.add(new paper.Point(pos.x, pos.y));
                    //paper.view.draw();
                }
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            if (currentFilledShape) {
                endFilledShape();
            }
            currentFilledShape = new paper.Path();

            if (strokeFilledPoly) {
                currentFilledShape.stroke = strokeFilledPoly;
                currentFilledShape.strokeColor = 'black';
            }
            currentFilledShape.closed = false;
            currentFilledShape.add(new paper.Point(pos.x, pos.y));
            //currentFilledShape.fillColor = fillColor;
            //currentFilledShape.blendMode = blendMode;
            currentFilledShape.stroke = strokeFilledPoly;
            currentFilledShape.strokeColor = 'black';

            //currentFilledShape.selected = true;
            break;
        default:
            console.log("filled shape called for " + event.type);
            break;
    }
}
function endFilledShape() {
    console.log("ending ");
    currentFilledShape.simplify(5);
    //currentFilledShape.closed = true;
    currentFilledShape.fillColor = fillColor;
    currentFilledShape.blendMode = blendMode;
    if (!strokeFilledPoly) {
        currentFilledShape.stroke = false;
        currentFilledShape.strokeColor = fillColor;
    }
    currentFilledShape = false;
    //paper.view.draw();

}

var currentLine = false;
var lastpt = false;
function line(event, linemode) {
    switch (event.type) {
        case "pointermove":
            if (event.buttons == 0) {
                switch (linemode) {
                    case "stroke":
                        if (currentLine) {
                            currentLine.simplify(10);
                        }
                        break;
                    default:
                        break;
                }
                currentLine = false;
                lastpt = false;
            }
            if (currentLine) {
                var pos = getCursorPosition(event);
                //currentLine.position = new paper.Point(pos.x, pos.y);
                //lastpt.set( pos.x,pos.y);
                switch (linemode) {
                    case "segment":
                        currentLine.lastSegment.point.set(pos.x, pos.y);
                        break;
                    case "polygon":
                        break;
                    case "stroke":
                        currentLine.add(new paper.Point(pos.x, pos.y));
                        break;
                    case "rect":
                        currentLine.bottomRight = new paper.Point(pos.x, pos.y);
                        //currentLine.bottomRight.x = pos.x;
                        //currentLine.bottomRight.y = pos.y;
                        break;
                    default:
                        break;
                }

                //paper.view.draw();
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            lastpt = new paper.Point(pos.x, pos.y);
            switch (linemode) {
                case "rect":
                    //currentLine = new paper.Rectangle(lastpt,new paper.Point(pos.x+100, pos.y+100));
                    currentLine = new paper.Rectangle({
                        rectangle: {
                            topLeft: [pos.x, pos.y],
                            bottomRight: [pos.y + 10, pos.y + 10]
                        },
                        strokeColor: 'black'
                    });
                    break;
                default:
                    currentLine = new paper.Path(new paper.Point(pos.x, pos.y), lastpt);
                    let tmpBrushSize = brushSize;
                    if (brushSize < 3) { tmpBrushSise = 3; }
                    currentLine.strokeWidth = tmpBrushSize;
                    currentLine.strokeColor = fillColor;
                    currentLine.blendMode = blendMode;
                    break;
            }
            break;
        default:
            console.log("line called for " + event.type);
            break;
    }
}
function downloadDataUri(options) {
    console.log("download data uri called");

    if (!options.url)
        options.url = "http://download-data-uri.appspot.com/";
    $('<form method="post" action="' + options.url
        + '" style="display:none"><input type="hidden" name="filename" value="'
        + options.filename + '"/><input type="hidden" name="data" value="'
        + options.data + '"/></form>').appendTo('body').submit().remove();
}

