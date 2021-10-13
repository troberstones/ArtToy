
 SVGInject.setOptions({
      useCache: false, // no caching
      copyAttributes: false, // do not copy attributes from `<img>` to `<svg>`
      makeIdsUnique: false, // do not make ids used within the SVG unique
      afterLoad: function(svg, svgString) {
        // add a class to the svg
        //svg.classList.add('my-class');
        svg.classList.add('uicontainer');
      },
      beforeInject: function(img, svg) {
        // wrap SVG in a div element
        var div = document.createElement('div');
        div.appendChild(svg);
        return div;
      },
      afterInject: function(img, svg) {
        // set opacity
        svg.style.opacity = 1;
        initUI();
      },
      onFail: function(img) {
        // set the image background red
        img.style.background = 'red';
      }
    });

    var dispatch = {
        empty: () => { console.log("empty called"); },
        test: () => { console.log("test called"); },
    };
// entry point function for registering UI interaction functions
// these will be called based on the UI element ID in the svg file.
// TODO: add code to register new UI svg files for additional controls 
// added by the sub documents. -> add svg element and register its inlinig using the
// handy library. Then let the registration code hook up the interaction

// register a function call in the dispatch object to handle UI events
function registerEventHandler(entryPoint, entryFun) {
    dispatch[entryPoint] = entryFun;
}
function initializeSVGCallbacks() {
    // loop over the ids from the svg file and register callbacks for each one.
    var uicontainter = document.getElementsByClassName("uicontainer");
    //console.log(uicontainter)
    //console.log(uicontainter.item(0).children)
    //var svgElms = uicontainter.item(0).children[0].childNodes;
    //var svgElms = uicontainter.item(0).children[0].children[2].childNodes
    var svgElms = uicontainter.item(0).childNodes;

    svgElms.forEach((element, index, array) => { 
        idName = element.id;
        //console.log("setup for "+idName);
        if(idName) {
            //console.log(idName);
            element.classList.add("svgButton");
            element.addEventListener("pointerdown", (evt)=> {
                //console.log("pressed:"+evt.currentTarget.id)
                dispatch[evt.currentTarget.id]();
            });
        }
    });

}
function initColorSlider() {
    var uicontainter = document.getElementsByClassName("uicontainer");
    console.log(uicontainter.item(1).children)
    var svgElms = uicontainter.item(1).childNodes;
    svgElms.forEach((element, index, array) => { 
        idName = element.id;
        if(idName) {
            console.log(idName);
            const SliderKnob = element.style.draggable = true;
           // ({
           //     draggable: true,
           //     dragBounds: {
           //         left: MIN_X,
           //         top: -CENTER_Y + MARGIN * 2,
           //         bottom: CENTER_Y - MARGIN * 2,
           //         right: MAX_X,
           //     },
           //     dragEnd: {
           //         y: 0,
           //         transition: { type: "spring", damping: 80, stiffness: 300 },
           //     },
           // })
            //element.classList.add("svgButton");
            //element.addEventListener("mousedown", (evt)=> {
            //    console.log("pressed:"+evt.currentTarget.id);
            //    //colorSliderClick(evt);
            //    //children[5].setAttribute("transform","matrix(1,0,0,1,"+evt.layerX+",-1.295)")
            //});
            //element.addEventListener("mousemove", (evt)=> {
            //    console.log("pressed:"+evt.currentTarget.id);
            //    //colorSliderClick(evt);
            //    //children[5].setAttribute("transform","matrix(1,0,0,1,"+evt.layerX+",-1.295)")
            //});
        }
    });
}
function colorSliderClick(evt) {
    let target = evt.currentTarget;
    let children = target.childNodes;
    console.log(children);
    let bboxwidth = target.getBBox()
    let mat = target.getScreenCTM().inverse();
    //console.log(evt.)
    let svg = target.ownerSVGElement;
    var pt = svg.createSVGPoint();
    pt.x = evt.pageX;
    pt.y = evt.pageY;
    //pt = pt.matrixTransform(svg.getScreenCTM().inverse());
    pt = pt.matrixTransform(mat);
    let xoff = bboxwidth.x;
    //pt.x -= xoff;
    children[5].setAttribute("transform", "translate(" + pt.x + ")");
    console.log(pt.x/bboxwidth.width);

}
var context = null;
var canv = null;
function initUI() {
    initializeSVGCallbacks();
    //initColorSlider();

    paletteInit();
    init_range_sliders();

    canv = document.getElementById("myCanvas");
    ctx = canv.getContext("2d");
    canvasInit();
    initLayerUI();
}
//window.onload = initUI();
//if(window.attachEvent) {
//    window.attachEvent('onload', yourFunctionName);
//} else {
//    if(window.onload) {
//        var curronload = window.onload;
//        var newonload = function(evt) {
//            curronload(evt);
//            yourFunctionName(evt);
//        };
//        window.onload = newonload;
//    } else {
//        window.onload = yourFunctionName;
//    }
//}