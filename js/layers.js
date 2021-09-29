registerEventHandler("order-top",() => { changeOrder("top"); });
registerEventHandler("order-up", () => { changeOrder("up"); });
registerEventHandler("order-down", () => { changeOrder("down"); });
registerEventHandler("order-bottom", () => { changeOrder("bottom"); });
registerEventHandler("delete", () => { changeOrder("delete"); });
registerEventHandler("duplicate", () => { changeOrder("duplicate"); });

function changeOrder(direction) {
    // TODO: this doesn't work because the last child changes all the time.
    var activeItem = paper.project.activeLayer.lastChild;
    if (activeItem) {
        let targetIndex = activeItem.index;
        switch (direction) {
            case "up":
                targetIndex += 1;
                paper.project.activeLayer.insertChild(targetIndex, activeItem);
                break;
            case "down":
                targetIndex -= 1;
                paper.project.activeLayer.insertChild(targetIndex, activeItem);
                break;
            case "top":
                activeItem.bringToFront();
                break;
            case "bottom":
                activeItem.sendToBack();
                break;
            case "delete":
                activeItem.remove();
                break;
            case "duplicate":
                activeItem.copyTo(paper.project.activeLayer);
                //paper.project.activeLayer.copyTo(activeItem);
                break;
            default:
                break;
        }
    }
}
var layerObject = {
    init:null,
    layerCanv:null,
    layerUICtx:null,
    layers:null,
    startPos:100,
    layerHeight:40,
    layerGap:10,
    canvasHeight:0,
    canvasOffset:20,
    //for(let i =0; i < layers.length; i++) {
    activeItem:null,
    layerUIProject:null,
    setupSVG:false,
    svgUIElement: null,
    symbolList: [],
    layerWidgets: []
};
function svgIsLoaded() {
    console.log("woot!");
    initLayerUI();
}
function initLayerUI() {
    if(!layerObject.init) {
        layerObject.init = true;
        layerObject.layerCanv = document.querySelector(".layeruicanvas");
        layerObject.canvasHeight = layerObject.layerCanv.height;
        //console.log(layerObject.layerCanv);
        //console.log("### look here ###");
        layerObject.layerUICtx = layerObject.layerCanv.getContext('2d');
        layerObject.layerUICtx.fillStyle = 'green';
        layerObject.layers = paper.project.layers;
        //console.log(layerObject.layers);
        layerObject.activePaperProject = paper.project;
        //layerObject.layerUIProject= paper.setup(layerObject.layerCanv);
        layerObject.layerUIProject = new Project(layerObject.layerCanv); 
        layerObject.svgUIElement = layerObject.layerUIProject.importSVG("layerIcons.svg",svgIsLoaded);
        return;
    }
    // Get the layers and store the current active paper project

    layerObject.layerUIProject.activate();

    if(!layerObject.setupSVG) {
        layerObject.setupSVG=true;
        //layerObject.layerUIProject.activeLayer.addChild(layerObject.svgUIElement);
        let children = layerObject.layerUIProject.getItems({name:(val)=>{return val!=null}});
        children.forEach(element => {
            if(element.name.match(/Icon/)) {
                layerObject.symbolList[element.name]= new SymbolDefinition(element);
            }
        });
        console.log(children);
        console.log(layerObject.symbolList)
    }
    let startPos = 100;
    // Add layer button
    let newButton = layerObject.symbolList["AddIcon"].place([25,50]);
    newButton.scale(1,.25)
    newButton.fillColor = "black";
    newButton.on('mouseenter', function () {
        this.fillColor = 'white';
    });
    newButton.on('mouseleave', function () {
        this.fillColor = 'green';
    });
    newButton.on("mouseup", function () {
        console.log("add");
        addLayer();
    });

    // remove layer button
    newButton= layerObject.symbolList["SubtractIcon"].place([75,50]);
    newButton.scale(1,.25)
    newButton.fillColor = "black";
    newButton.on('mouseenter', function () {
        this.fillColor = 'white';
    });
    newButton.on('mouseleave', function () {
        this.fillColor = 'green';
    });
    newButton.on("mouseup", function () {
        console.log("add");
        activeLayerOperation("remove");
    });
    for(let i =0; i < layerObject.activePaperProject.layers.length; i++) {
        makeLayerIcon(layerObject.activePaperProject.layers[i]);
    }
    updateLayerDisplay();
    layerObject.activePaperProject.activate();
}
function addLayer() {
    let newLayer = layerObject.activePaperProject.addLayer(new Layer({
        name: `${layerObject.activePaperProject.layers.length}_layer`,
        strokeColor: "black"
    }));
    makeLayerIcon(newLayer);
    updateLayerDisplay()
}
function activeLayerOperation(mode) {
    switch (mode) {
        case "remove":
           let curLayer = layerObject.activePaperProject.activeLayer 
           curLayer["LayerWidgetItem"].remove();
           curLayer.remove();
            break;
        case "hide":
            
            break;
    
        default:
            break;
    }
    updateLayerDisplay();
}
function layerComputeY(i) {
    //return  layerObject.startPos + layerObject.layerGap + i *
    return  layerObject.canvasHeight - (layerObject.canvasOffset + i *
        (layerObject.layerHeight + layerObject.layerGap));

}
function makeLayerIcon(layerItem) {
    layerObject.layerUIProject.activate();
    let i = layerItem.index;
    let yval = layerComputeY(layerItem.index);
    let testPath = layerObject.symbolList["layerIcon"].place([50, yval]);
    testPath.scale(1, .25);
    let testText = new Text
    var text = new PointText(new Point(30, yval));


    text.fillColor = 'black';
    // Set the content of the text item:
    text.content = layerObject.activePaperProject.layers[i].name;
    //if(i == layerObject.activePaperProject.activeLayer.index) {
    //    testPath.translate([10,0]);
    //}

    let visButton = new Path.Circle({ center: [10, yval], radius: 10 });
    visButton.fillColor = layerItem.visible? "green" : "red";
    visButton.on("mouseup",function() {
        layerItem.visible = !layerItem.visible;
        this.fillColor = layerItem.visible? "green" : "red";
        //layerItem.fillColor = null;
        
    });

    let draftButton = new Path.Circle({ center: [30, yval], radius: 10 });
    draftButton.fillColor = layerItem.data.draft? "green" : "red";
    draftButton.on("mouseup", function () {
        if (!'draft' in layerItem.data) {
        layerItem.data['draft'] = false;
        }
        let allChildren = layerItem.getItems({recursive:true, match:()=>{return true;}})

        allChildren.forEach((itm) => {
            //itm.data.fillColor = itm.fillColor;
            //itm.data.strokeColor = itm.strokeColor;
            //itm.data.stroke
            if (!layerItem.data.draft) {
                // for this to work we need a deep copy
                //itm.data.style = itm.style;
                itm.data.fillColor = itm.fillColor;
                itm.data.strokeColor= itm.strokeColor;
                itm.data.strokeWidth= itm.strokeWidth;
                itm.fillColor = null;
                itm.strokeColor = "black";
                itm.strokeWidth = 1;
            } else {
                itm.fillColor = itm.data.fillColor;
                itm.strokeColor = itm.data.strokeColor;
                itm.strokeWidth = itm.data.strokeWidth;
                //itm.style = itm.data.style;
            }
        });
        layerItem.data.draft = !layerItem.data.draft;
        this.fillColor = layerItem.data.draft? "green" : "red";
    //layerItem.fillColor = null;
    });

    testPath.fillColor = "blue"
    testPath.on('mouseenter', function () {
        this.fillColor = 'red';
        layerItem.shadowColor = "black";
        layerItem.shadowOffset = [0,0];
        layerItem.shadowBlur = 10;
    });
    testPath.on('mouseleave', function () {
        this.fillColor = 'blue';
        layerItem.shadowColor = null
        layerItem.shadowOffset = null
        layerItem.shadowBlur = null;
    });
    testPath.on('mouseup', function () {
        this.fillColor = 'purple';
        layerObject.activePaperProject.layers[i].activate();
        updateLayerDisplay();
    });

    let newGroup = new Group([testPath,text,visButton,draftButton]);
    layerItem["LayerWidgetItem"] = newGroup;

    layerObject.activePaperProject.activate();
}
function updateLayerDisplay() {
    //layerObject.layerUIProject.activate();
    layerObject.activePaperProject.layers.forEach((layer)=>{
        let yval = layerComputeY(layer.index);
        if(layer.index == layerObject.activePaperProject.activeLayer.index) {
            layer["LayerWidgetItem"].position = [60,yval]; 
        }  else {
            layer["LayerWidgetItem"].position = [50,yval]; 
        }
    });
    //layerObject.activePaperProject.activate();
}