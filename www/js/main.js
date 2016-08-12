// Initialize tile-div
var tileDivs = document.getElementsByClassName('tile-div')
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

// Initialize pages
var pages = [
    new TitlePage(),
    new SetupPage()];
var pageIndex = 0;

// Initialize story deck
var numberofRounds = 12;
var shuffledCards = CARDSET.Cards.sort(function () { return .5 - Math.random() });
var selectedCards = shuffledCards.slice(0, numberofRounds).sort(function (a,b) { return a.Number - b.Number; });
for (var index = 0; index < selectedCards.length; index++) {
    var element = selectedCards[index];
    pages.push(new TileGamePage(index+1));
    pages.push(new StoryPage(index + 1, element.Number));
}

pages.push(new GameEndPage());

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