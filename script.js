let count = 0;

// Assign (row, column) to each cell
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
        let ele = $('.cell').eq(count);
        ele.attr('data-row', i);
        ele.attr('data-col', j);
        count++;
    }
}

// Toggle instruction panel
$('.info').on('click', function() {
    $('.para').toggleClass('show');
});
$('.tryBtn').on('click', function() {
    $('.para').toggleClass('show');
});

// Game variables
let totalScore = 0, userScore = 0, friendScore = 0;
let playerTurn = "user"; // "user" or "friend"
let state = Array.from({ length: 10 }, () => Array(10).fill(0));

// Reset the board
function init() {
    count = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            let ele = $('.cell').eq(count);
            ele.removeClass('user friend win');
            count++;
        }
    }
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            state[i][j] = 0;
        }
    }
    playerTurn = "user"; // Start with user
}

// Highlight 5 winning balls
function win(start, end) {
    let increI = Math.round((end.x - start.x) / 4);
    let increJ = Math.round((end.y - start.y) / 4);
    for (let i = 0; i < 5; i++) {
        let pos1 = start.x + increI * i;
        let pos2 = start.y + increJ * i;
        let ele = $(`div[data-row=${pos1}][data-col=${pos2}]`);
        ele.addClass('win');
    }
}

// Handle cell click
$('.cell').on('click', function() {
    let classes = $(this).attr('class');
    if (classes.includes("user") || classes.includes("friend")) return; // Already occupied

    let row = Number($(this).attr('data-row'));
    let col = Number($(this).attr('data-col'));

    if (playerTurn === "user") {
        $(this).addClass('user');
        state[row][col] = -1; // user's move
    } else {
        $(this).find('.ball').addClass('friend');

        state[row][col] = 1; // friend's move
    }

    let start = { x: 0, y: 0 }, end = { x: 0, y: 0 };
    if (fiveInRow(row, col, start, end) != 0) {
        win(start, end);
        $('.playBtn').text("Next");
        $('.greeting').text(playerTurn === "user" ? "Congratulations (You)!" : "Congratulations (Friend)!");
        $('.overlay').toggleClass('show');
        totalScore++;
        if (playerTurn === "user") {
            $('.userScore').text(`${++userScore}/${totalScore}`);
        } else {
            $('.computerScore').text(`${++friendScore}/${totalScore}`);
        }
        return;
    }

    // Switch turn
    playerTurn = (playerTurn === "user") ? "friend" : "user";
});

// Check 5 in a row
function fiveInRow(i, j, start, end) {
    if (i < 0 || j < 0 || i >= 10 || j >= 10) {
        console.log("error from fiveInRow()");
        return;
    }
    let value = state[i][j];
    let cnt = 1, ii, jj;
    const row = 5;

    // Horizontal check
    jj = j + 1;
    start.x = i; start.y = j;
    end.x = i; end.y = j;
    while (jj < 10) {
        if (state[i][jj] != value) break;
        cnt++;
        end.x = i; end.y = jj++;
        if (cnt == row) return value;
    }
    jj = j - 1;
    while (jj >= 0) {
        if (state[i][jj] != value) break;
        cnt++;
        start.x = i; start.y = jj--;
        if (cnt == row) return value;
    }

    // Vertical check
    cnt = 1;
    ii = i + 1;
    start.x = i; start.y = j;
    end.x = i; end.y = j;
    while (ii < 10) {
        if (state[ii][j] != value) break;
        cnt++;
        end.x = ii++; end.y = j;
        if (cnt == row) return value;
    }
    ii = i - 1;
    while (ii >= 0) {
        if (state[ii][j] != value) break;
        cnt++;
        start.x = ii--; start.y = j;
        if (cnt == row) return value;
    }

    // Diagonal ↘️
    cnt = 1;
    ii = i + 1; jj = j + 1;
    start.x = i; start.y = j;
    end.x = i; end.y = j;
    while (ii < 10 && jj < 10) {
        if (state[ii][jj] != value) break;
        cnt++;
        end.x = ii++; end.y = jj++;
        if (cnt == row) return value;
    }
    ii = i - 1; jj = j - 1;
    while (ii >= 0 && jj >= 0) {
        if (state[ii][jj] != value) break;
        cnt++;
        start.x = ii--; start.y = jj--;
        if (cnt == row) return value;
    }

    // Diagonal ↙️
    cnt = 1;
    ii = i - 1; jj = j + 1;
    start.x = i; start.y = j;
    end.x = i; end.y = j;
    while (ii >= 0 && jj < 10) {
        if (state[ii][jj] != value) break;
        cnt++;
        start.x = ii--; start.y = jj++;
        if (cnt == row) return value;
    }
    ii = i + 1; jj = j - 1;
    while (ii < 10 && jj >= 0) {
        if (state[ii][jj] != value) break;
        cnt++;
        end.x = ii++; end.y = jj--;
        if (cnt == row) return value;
    }

    return 0;
}

// Restart button
$('.playBtn').on('click', function() {
    let ele = $('.playBtn');
    let text = ele.text();
    if (text == "Play" || text == "Next") {
        ele.text("Restart");
        init();
        $('.overlay').removeClass('show');
    } else {
        init();
        $('.overlay').removeClass('show');
    }
});
