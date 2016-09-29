// Initialize tile-div
var tileDivs = document.getElementsByClassName('tile-div');
for (var index = 0; index < tileDivs.length; index++) {
    var element = tileDivs[index];
    element.innerHTML = TILES;
}

// Initialize season selection
var availableSeasons = CARDSET.Cards.map(function (card) { return card.Season; });
availableSeasons = availableSeasons.filter(function (v, i) { return availableSeasons.indexOf(v) == i; });
var inputElements = document.getElementById('season-select').getElementsByTagName('input');
for (var index = 0; index < inputElements.length; index++) {
    var element = inputElements[index];
    if (element.type != 'checkbox') continue;
    if (!availableSeasons.some(function (season) {
        return season === Number(element.value);
    })) element.setAttribute("disabled", "disabled");;
}

// Initialize pages
function initializePages() {
    pages = [
        new TitlePage(),
        new SetupPage()
    ];
    pageIndex = 0;
    return pages;
}

var pageIndex = 0;
var pages = [];
initializePages();

// Setup navigation event handlers
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(event) {
    previousPage();
}

window.onclick = function () {
    if (!deviceReady) return;
    if (pageIndex === 0) return;
    nextPage();
};

// Register season-select-form submit
var form = document.getElementById('season-select-form');
form.addEventListener('submit', startNewGame);

function startNewGame(e) {
    e.preventDefault();
    var selectedSeasons = getSelectedSeasons();
    if (selectedSeasons.length === 0) return false;

    // Initialize remaining pages
    var numberofRounds = 12;
    var cardsFromSelectedSeasons = CARDSET.Cards.filter(function (card) {
        return selectedSeasons.some(function (season) {
            return season === card.Season;
        });
    });

    if (cardsFromSelectedSeasons.length < 12) return false;

    var shuffledCards = utils.shuffle(cardsFromSelectedSeasons);
    var selectedCards = shuffledCards.slice(0, numberofRounds).sort(function (a, b) { return a.Number - b.Number; });
    for (var index = 0; index < selectedCards.length; index++) {
        var element = selectedCards[index];
        var spawns = Math.ceil((index + 1) / 4) + 1;
        var availableTileIndices = [];
        var numberOfAvailableTiles = Math.min(index + 3, 9);
        for (var i = 0; i < numberOfAvailableTiles; i++) {
            availableTileIndices.push(i);
        }
        availableTileIndices = utils.shuffle(availableTileIndices);
        for (var j = 0; j < spawns; j++) {
            pages.push(new TileGamePage(index + 1, availableTileIndices[j]));
        }
        pages.push(new StoryPage(index + 1, element.Number));
    }

    pages.push(new GameEndPage());

    nextPage();
    return true;
}

function getSelectedSeasons() {
    var selectedSeasons = [];
    var inputElements = document.getElementById('season-select').getElementsByTagName('input');
    for (var index = 0; index < inputElements.length; index++) {
        var element = inputElements[index];
        if (element.type != 'checkbox') continue;
        if (!element.checked) continue;
        selectedSeasons.push(Number(element.value));
    }

    return selectedSeasons;
}


// Register restart-form submit
var form = document.getElementById('restart-form');
form.addEventListener('submit', restartGame);

function restartGame(e) {
    initializePages();
}

function nextPage() {
    if (pageIndex + 1 >= pages.length) return;
    changePage(pages[pageIndex + 1]);
    pageIndex++;
    updateContinueVisibility();
}

function previousPage() {
    if (pageIndex === 0) return;
    changePage(pages[pageIndex - 1]);
    pageIndex--;
    updateContinueVisibility();
}

function changePage(nextPage) {
    var currentPage = pages[pageIndex];
    var currentPageDiv = document.getElementById(currentPage.id);
    currentPageDiv.setAttribute('style', 'display:none');
    var nextPageDiv = document.getElementById(nextPage.id);
    nextPageDiv.setAttribute('style', 'display:block;');
    nextPage.show();
}

function updateContinueVisibility() {
    var continueDiv = document.getElementById('continue');
    if (pageIndex === 0 || pageIndex == pages.length - 1) continueDiv.setAttribute('style', 'display:none;');
    else continueDiv.setAttribute('style', 'display:block;');
}