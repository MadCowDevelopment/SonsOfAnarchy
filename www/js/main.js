// Initialize tile-div
var tileDivs = document.getElementsByClassName('tile-div');
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

// Initialize pages
var pages = [
    new TitlePage(),
    new SetupPage()];
var pageIndex = 0;

// Initialize remaining pages
var numberofRounds = 12;
var shuffledCards = shuffle(CARDSET.Cards);
var selectedCards = shuffledCards.slice(0, numberofRounds).sort(function (a, b) { return a.Number - b.Number; });
for (var index = 0; index < selectedCards.length; index++) {
    var element = selectedCards[index];
    var spawns = Math.ceil((index + 1) / 4) + 1;
    pages.push(new TileGamePage(index + 1, spawns));
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
};

function nextPage() {
    if (pageIndex + 1 >= pages.length) return;
    changePage(pages[pageIndex + 1]);
    pageIndex++;
}
function previousPage() {
    if (pageIndex === 0) return;
    changePage(pages[pageIndex - 1]);
    pageIndex--;
}
function changePage(nextPage) {
    var currentPage = pages[pageIndex];
    var currentPageDiv = document.getElementById(currentPage.id);
    currentPageDiv.setAttribute('style', 'display:none');
    var nextPageDiv = document.getElementById(nextPage.id);
    nextPageDiv.setAttribute('style', 'display:block;');
    nextPage.show();
}