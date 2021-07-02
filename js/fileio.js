registerEventHandler("quicksave",()=>{quicksave();});
registerEventHandler("New",()=>{newDocument();});
registerEventHandler("Trash",()=>{closeDocument();});
registerEventHandler("download",()=>{download();});
registerEventHandler("upload",()=>{upload();});

function closeDocument() {
    console.log("close doc called");
    // prompt save?
    paper.project.clear();
}
function newDocument() {
    console.log("New doc called");
    paper.project.clear();
}
function quicksave() {
    console.log("Quicksave called");
    localStorage.setItem("drawing", paper.project.exportJSON({ asString: true }));

}
function download() {
   downloadSVG();
}
function upload() {
   loadSVG();
}
function downloadSVG() {
        var svg = paper.project.exportSVG({ asString: true });
        console.log("Export button pressed");
        console.log(svg);

        var anchor = document.createElement('a');

        console.log(anchor);
        var svgData = 'data:image/svg+xml;base64,' + btoa(svg);
        anchor.setAttribute('href', svgData);
        anchor.setAttribute('download', 'export.svg');
        anchor.click();
}

//function downloadDataUri(options) {
//    console.log("download data uri called");
//
//    if (!options.url)
//        options.url = "http://download-data-uri.appspot.com/";
//    $('<form method="post" action="' + options.url
//        + '" style="display:none"><input type="hidden" name="filename" value="'
//        + options.filename + '"/><input type="hidden" name="data" value="'
//        + options.data + '"/></form>').appendTo('body').submit().remove();
//}