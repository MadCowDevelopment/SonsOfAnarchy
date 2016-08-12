// Initialize tile-div
var tileDivs = document.getElementsByClassName('tile-div')
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

// Initialize pages
var pages = [
    new Page("title"),
    new SetupPage(),
    new TileGamePage(1),
    new StoryPage(1)];
var pageIndex = 0;

// Setup navigation event handlers
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(event) {
    previousPage();
}
window.onclick = function () {
    if (!deviceReady) return;
    nextPage();
}

nextPage = function () {
    if (pageIndex + 1 >= pages.length) return;
    changePage(pages[pageIndex + 1]);
    pageIndex++;
}
previousPage = function () {
    if (pageIndex == 0) return;
    changePage(pages[pageIndex - 1]);
    pageIndex--;
}
changePage = function (nextPage) {
    var currentPage = pages[pageIndex];
    var currentPageDiv = document.getElementById(currentPage.id);
    currentPageDiv.setAttribute('style', 'display:none');
    var nextPageDiv = document.getElementById(nextPage.id);
    nextPageDiv.setAttribute('style', 'display:block;');
    nextPage.show();
}

// nextPage();
// nextPage();
// nextPage();