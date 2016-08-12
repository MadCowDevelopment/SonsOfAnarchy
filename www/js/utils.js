function shuffle(original) {
    var array = original.slice();
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function removeRandom(array) {
    var index = Math.floor(Math.random() * array.length);
    var value = array.splice(index, 1)[0];
    return value;
}