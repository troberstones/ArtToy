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