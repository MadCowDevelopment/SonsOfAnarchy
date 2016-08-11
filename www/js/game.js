var currentPage = "title";

var previousPages = ["title"];

document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(event) {
    if (previousPages.length == 0) return;
    var previousPage = previousPages.pop();
    changePage(previousPage);
    previousPages.pop();
}

window.onclick = function () {
    if (!deviceReady) return;
    if (currentPage == "title") {
        changePage("setup");
    } else if (currentPage == "setup") {
        changePage("game");
    } else if (currentPage == "game") {
        // TODO: advance round
    }
}

changePage = function (id) {
    var currentPageDiv = document.getElementById(currentPage);
    previousPages.push(currentPage);
    currentPageDiv.setAttribute('style', 'display:none');
    var nextPageDiv = document.getElementById(id);
    nextPageDiv.setAttribute('style', 'display:block;');
    currentPage = id;
}