'use strict';

var request = new XMLHttpRequest();
request.open("GET", "js/cardset.json", false);
request.send(null)
var CARDSET = JSON.parse(request.responseText);

const MAXIMUM_NUMBER_OF_TILES = 9;

function Page(id, title, activate) {
    this.id = id;
    this.title = title;
    this.activate = activate;
    this.isInitialized = false;

    this.show = function () {
        document.getElementById("header").innerHTML = this.title;
        this.activate();
    }
}

function TitlePage() {
    Page.call(this, "title", "", function () { });
}
TitlePage.prototype = Object.create(Page.prototype);

function TilePage(title, text, numberOfActiveTiles, numberOfSelectedTiles) {
    this.activeTiles = [];
    this.selectedTiles = [];

    if (numberOfActiveTiles > MAXIMUM_NUMBER_OF_TILES) {
        numberOfActiveTiles = MAXIMUM_NUMBER_OF_TILES;
    }

    for (var i = 0; i < numberOfActiveTiles; i++) {
        this.activeTiles.push(i + 1);
    }

    var shuffledActiveTiles = shuffle(this.activeTiles);
    var selectedTiles = shuffledActiveTiles.slice(0, numberOfSelectedTiles);
    for (var i = 0; i < selectedTiles.length; i++) {
        var element = selectedTiles[i];
        this.selectedTiles.push(element);
    }

    var resetTile = function (id, num) {
        var tile = getTile(id, num);
        tile.classList.remove("selected")
        tile.classList.remove("activate");
        tile.classList.add("inactive");
    }
    var activateTile = function (id, num) {
        var tile = getTile(id, num);
        tile.classList.remove("selected")
        tile.classList.remove("inactive");
        tile.classList.add("active");
    }

    var selectTile = function (id, num) {
        var tile = getTile(id, num);
        tile.classList.remove("active")
        tile.classList.remove("inactive");
        tile.classList.add("selected");
    }

    var getTile = function (id, num) {
        var tilesContainer = document.getElementById(id);
        var allTiles = tilesContainer.getElementsByClassName("tile");
        for (var index = 0; index < allTiles.length; index++) {
            var element = allTiles[index];
            if (element.id == "tile" + num) return element;
        }
    }

    var activate = function () {
        showById('place-dudes');
        hideById('story-card');
        document.getElementById('page-description').innerHTML = text;
        for (var index = 0; index < MAXIMUM_NUMBER_OF_TILES; index++) {
            resetTile(this.id, index + 1);
        }
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

function SetupPage() {
    TilePage.call(this, "Setup", "Set up the game as usual and place 2 enemy dudes on each of the following spaces:", 3, 2);
}
SetupPage.prototype = Object.create(TilePage.prototype);

function TileGamePage(round) {
    TilePage.call(this, "Round " + round, "Place 1 dude on each of the highlighted tiles:", round + 3, 2);
}
TileGamePage.prototype = Object.create(TilePage.prototype);

function StoryPage(round, number) {
    var card = CARDSET.Cards[number - 1];
    var activate = function () {
        showById('story-card');
        hideById('place-dudes');
        document.getElementById('card-image').setAttribute('src', "cards/" + card.Number + ".png");
        document.getElementById('page-description').innerHTML = "Follow the card text:";
        document.getElementById('card-number').innerHTML = card.Number;
        document.getElementById('card-name').innerHTML = card.Title;
        document.getElementById('traits').innerHTML = card.Traits.reduce(function (a, b) { return a + " - " + b; });
        document.getElementById('event-text').innerHTML = card.Text;
        document.getElementById('flavor-text').innerHTML = card.FlavorText + " - " + card.FlavorCharacter;
    };

    Page.call(this, "game", "Round " + round, activate);

}
StoryPage.prototype = Object.create(Page.prototype);

function GameEndPage() {
    Page.call(this, "title", "GAME OVER", function () { })
}
GameEndPage.prototype = Object.create(Page.prototype);

var showById = function (id) {
    document.getElementById(id).setAttribute('style', 'display:block');
}

var hideById = function (id) {
    document.getElementById(id).setAttribute('style', 'display:none');
}