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
    layerHeight:50,
    layerGap:20,
    //for(let i =0; i < layers.length; i++) {
    activeItem:null,
    layerUIProject:null,
    setupSVG:false,
    svgUIElement: null,
    symbolList: []
};
function initLayerUI() {
    if(!layerObject.init) {
        layerObject.init = true;
        layerObject.layerCanv = document.querySelector(".layeruicanvas");
        //console.log(layerObject.layerCanv);
        //console.log("### look here ###");
        layerObject.layerUICtx = layerObject.layerCanv.getContext('2d');
        layerObject.layerUICtx.fillStyle = 'green';
        layerObject.layers = paper.project.layers;
        //console.log(layerObject.layers);
        layerObject.activePaperProject = paper.project;
        //layerObject.layerUIProject= paper.setup(layerObject.layerCanv);
        layerObject.layerUIProject = new Project(layerObject.layerCanv); 
        layerObject.svgUIElement = layerObject.layerUIProject.importSVG("layerIcons.svg",initLayerUI);
        return;
    }
    const layerHeight = 30;
    const layerGap = 20;

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
        //children.forEach(element => {
        //    print(`${element.name} SVG objet`);
        //});

    //paper.project.clear();
    let startPos = 100;
    //let addButton = new Path.Rectangle(new Point([0,0]),new Point([50,50]));
    //let addButton = new Path.Circle({ center: [50, 50], radius: layerHeight / 2 });
    let addButton = layerObject.symbolList["AddIcon"].place([50,50]);
    addButton.scale(1,.25)
    addButton.fillColor = "black";
    addButton.on('mouseenter', function () {
        this.fillColor = 'white';
    });
    addButton.on('mouseleave', function () {
        this.fillColor = 'green';
    });
    addButton.on("mouseup", function () {
        console.log("add");
        layerObject.activePaperProject.addLayer(new Layer({
            name: `${layerObject.activePaperProject.layers.length}_layer`,
            strokeColor: "black"
        }));
        initLayerUI();
    });
    // for(let i =0; i < 5; i++) {
    for(let i =0; i < layerObject.activePaperProject.layers.length; i++) {
        //layerUICtx.rect(10, layerGap+i*(layerHeight+layerGap), 150, layerHeight);
        let yvalue = startPos + layerGap + i * (layerHeight + layerGap)
        //let testPath = new Path.Circle({ center: [50, yvalue], radius: layerHeight/2 });
        let testPath = layerObject.symbolList["layerIcon"].place([50, yvalue]);
        testPath.scale(1,.25);
        let testText = new Text
        var text = new PointText(new Point(30, yvalue));
        text.fillColor = 'black';
        // Set the content of the text item:
        text.content = layerObject.activePaperProject.layers[i].name;

        testPath.fillColor = "blue"
        testPath.on('mouseenter', function() {
            this.fillColor = 'red';
        });
        testPath.on('mouseleave', function() {
            this.fillColor = 'blue';
        });
        testPath.on('mouseup', function() {
            this.fillColor = 'purple';
            layerObject.activePaperProject.layers[i].activate();
        });
        //layerUICtx.fill();
    }
    layerObject.activePaperProject.activate();
}
