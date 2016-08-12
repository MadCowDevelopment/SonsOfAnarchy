function Page(id, title, activate) {
    this.id = id;
    this.title = title;
    this.activate = activate;
    this.isInitialized = false;

    this.show = function () {
        this.activate();
    }
}

function SetupPage() {
    TilePage.call(this, "Setup", "Set up the game as usual and place 2 enemy dudes on each of the following spaces:", 3, 2);
}
SetupPage.prototype = Object.create(TilePage.prototype);

function TilePage(title, text, activeTiles, selectedTiles) {
    this.activeTiles = [];
    this.selectedTiles = [];

    this.activeTiles = [1, 2, 3, 4, 5];
    var random = Math.floor(Math.random() * 5) + 1;
    this.selectedTiles.push(random);

    var activate = function () {
        showById('place-dudes');
        hideById('story-card');
        document.getElementById('page-description').innerHTML = text;
        for (var index = 0; index < this.activeTiles.length; index++) {
            var element = this.activeTiles[index];
            activateTile(this.id, element);
        }

        for (var index = 0; index < this.selectedTiles.length; index++) {
            var element = this.selectedTiles[index];
            selectTile(this.id, element);
        }
    }

    Page.call(this, "game", title, activate);
}
TilePage.prototype = Object.create(Page.prototype);

function TileGamePage(round) {
    TilePage.call(this, "Round " + round, "Place 1 dude on each of the highlighted tiles:", round * 2 + 3, 2);
}
TileGamePage.prototype = Object.create(TilePage.prototype);

function StoryPage(round) {
    var activate = function () {
        showById('story-card');
        hideById('place-dudes');
        document.getElementById('page-description').innerHTML = "Follow the card text:";
    };

    Page.call(this, "game", "Round " + round, activate);

}
StoryPage.prototype = Object.create(Page.prototype);

showById = function (id) {
    document.getElementById(id).setAttribute('style', 'display:block');
}

hideById = function (id) {
    document.getElementById(id).setAttribute('style', 'display:none');
}

var tileDivs = document.getElementsByClassName('tile-div')
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

var pages = [
    new Page("title"),
    new SetupPage(),
    new TileGamePage(1),
    new StoryPage(1)];

var pageIndex = 0;

activateTile = function (id, num) {
    var tile = getTile(id, num);
    tile.classList.remove("selected")
    tile.classList.remove("inactive");
    tile.classList.add("active");
}

selectTile = function (id, num) {
    var tile = getTile(id, num);
    tile.classList.remove("active")
    tile.classList.remove("inactive");
    tile.classList.add("selected");
}

getTile = function (id, num) {
    var tilesContainer = document.getElementById(id);
    var allTiles = tilesContainer.getElementsByClassName("tile");
    for (var index = 0; index < allTiles.length; index++) {
        var element = allTiles[index];
        if (element.id == "tile" + num) return element;
    }
}


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
    updateBindings(nextPage);
    nextPage.show();
}

updateBindings = function (page) {
    var title = document.getElementById("header");
    title.innerHTML = page.title;
}

nextPage();
nextPage();
nextPage();