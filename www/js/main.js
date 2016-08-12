// Initialize tile-div
var tileDivs = document.getElementsByClassName('tile-div')
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

// Initialize pages
var pages = [
    new TitlePage(),
    new SetupPage(),
    new TileGamePage(1)];
var pageIndex = 0;

for(var i=0; i<23; i++) {
    pages.push(new StoryPage(i+1, i+1));
}

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