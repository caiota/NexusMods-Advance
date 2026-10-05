function REMOVE_MOD_STATUSVIEW() {
  if (options['HideModStatus'] !== true) {
    return;
  }
  for (const item of VISIBLE_ELEMENTS) {
    if (!item.isConnected) {
      VISIBLE_ELEMENTS.delete(item);
      continue;
    }
    if (!item.matches || !item.matches("div[class*='mod-tile']") && !item.matches("li.mod-tile")) {
      continue;
    }
    if (item.hasAttribute("REMOVED_STATUS")) {
      continue;
    }
    const itemContainer = item.querySelector("div.mod-tile-dl-status,svg path[d='M21,5L9,17L3.5,11.5L4.91,10.09L9,14.17L19.59,3.59L21,5M3,21V19H21V21H3Z']");
    if (!itemContainer) {
      continue;
    }
    if(itemContainer.classList.contains("mod-tile-dl-status")){

    var toolTip = itemContainer;

    }else{
    var toolTip = itemContainer.closest("div");
    }
    if (toolTip) {
      toolTip.style.visibility = "hidden";
      item.addEventListener("mouseenter", function() {
        toolTip.style.visibility = "visible";
      }, true);
      item.addEventListener("mouseleave", function() {
        toolTip.style.visibility = "hidden";
      }, true);
    }
    item.setAttribute("REMOVED_STATUS", true);
  }
}