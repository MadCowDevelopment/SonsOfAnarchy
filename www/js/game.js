function Page(id, title, initialize, activate) {
    this.id = id;
    this.title = title;
    this.initialize = initialize;
    this.activate = activate;
    this.isInitialized = false;

    this.activeTiles = [];
    this.selectedTiles = [];

    this.show = function () {
        if (!this.isInitialized) {
            this.initialize(this.id);
            this.isInitialized = true;
        }

        this.activate(this.id);

        for (var index = 0; index < this.activeTiles.length; index++) {
            var element = this.activeTiles[index];
            activateTile(id, element);
        }
        for (var index = 0; index < this.selectedTiles.length; index++) {
            var element = this.selectedTiles[index];
            selectTile(id, element);
        }
    }

    this.showTiles = function () {
        document.getElementById('place-dudes').setAttribute('style', 'display:block')
        document.getElementById('story-card').setAttribute('style', 'display:none');
    }

    this.showStory = function () {
        document.getElementById('place-dudes').setAttribute('style', 'display:none')
        document.getElementById('story-card').setAttribute('style', 'display:block');
    }
}

var tileDivs = document.getElementsByClassName('tile-div')
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

var pages = [
    new Page("title", "", function (id) { }, function (id) { }),
    new Page("setup", "Setup", function (id) {
        this.activeTiles = [1, 2, 3];
        var random = Math.floor(Math.random() * 3) + 1;
        for (var index = 0; index < this.activeTiles.length; index++) {
            var element = this.activeTiles[index];
            if (element != random) this.selectedTiles.push(element);
        }
    }, function (id) { }),
    new Page("game", "Round 1", function (id) {
        this.activeTiles = [1, 2, 3, 4, 5];
        var random = Math.floor(Math.random() * 5) + 1;
        this.selectedTiles.push(random);
        this.showTiles();
    }, function (id) { })];
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