var config = {
    apiKey: "AIzaSyDGueBKukCl4V5wirT3D_uNa7XbNroorJE",
    authDomain: "rps-camacho.firebaseapp.com",
    databaseURL: "https://rps-camacho.firebaseio.com",
    projectId: "rps-camacho",
    storageBucket: "",
    messagingSenderId: "740913573129"
};

firebase.initializeApp(config);

var database = firebase.database();

var options = 'rps';

var username = '';
var choice = '';
var wins = 0;

var opponent = '';
var oppChoice = '';

var updateFB = function () {
    database.ref().push({
        username: username,
        choice: choice,
        wins: wins
    })
}

var resetGame = function () {
    choice = '';
    oppChoice = '';
    $("#choice").text('');
    $("#result").text('');
}

var decideWinner = function () {
    var endstring = '';
    if ((choice == 's' && oppChoice == 'p') || (choice == 'p' && oppChoice == 'r') || (choice == 'r' && oppChoice == 's')) {
        wins++;
        endstring = 'won';

    } else if ((oppChoice == 's' && choice == 'p') || (oppChoice == 'p' && choice == 'r') || (oppChoice == 'r' && choice == 's')) {
        endstring = 'lost';
    } else {
        endstring = 'tied';
    }
    $("#result").text("Opponent chose " + oppChoice + ", you " + endstring + "!");
    updateFB();
}

$('#submitBtn').on("click", function (event) {
    event.preventDefault();
    username = $('#username').val().trim();

    updateFB();
})

document.onkeyup = function (event) {
    if (username.length > 0 && choice == '') {
        var input = event.key;

        for (var i = 0; i < options.length; i++) {
            if (options[i] == input.toLowerCase()) {
                choice = options[i];
                $('#choice').text('You chose: ' + choice);
                updateFB();
                if (oppChoice !== '') decideWinner();
            }
        }
    }
}

database.ref().on("child_added", function (snapshot) {
    var snapVal = snapshot.val();
    if (username !== '' && username !== snapVal.username) {
        opponent = snapVal.username;
        if (snapVal.choice !== '') {
            oppChoice = snapVal.choice;
            if (choice !== '') {
                decideWinner();
            }
        }
    }
})