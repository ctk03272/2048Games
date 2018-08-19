var grid;
var grid_new;
var score = 0;

document.addEventListener("DOMContentLoaded", function () {
    // Wait till the browser is ready to render the game (avoids glitches)
    var gameSize = prompt('몇칸짜리 게임을 하시겠습니까?');
    var manager = new GameManager(gameSize,
        KeyManager)

});

function GameManager(size, keyInputManger) {
    this.size = size;
    this.keyInputManger = new keyInputManger;
    this.startTiles = 2;
    this.setup();
}
GameManager.prototype.setup = function () {
    this.score = 0;
    this.gamover = false;
    this.won = false;

    this.outPutManager = new OutPutManager(this.size);
    this.addStartTiles();
    grid = this.outPutManager.output;
}

GameManager.prototype.addStartTiles = function () {
    for (var i = 0; i < this.startTiles; i++) {
        this.addRandomTile();
    }
}

GameManager.prototype.addRandomTile = function () {
    var add = false;
    while (!add) {
        var tempX = Math.floor(Math.random() * (this.size));
        var tempY = Math.floor(Math.random() * (this.size));
        if (this.outPutManager.availabe(tempX, tempY)) {
            this.outPutManager.output[tempX][tempY] = 2;
            add = true;
            var rows = document.getElementsByClassName("grid-cell");
            rows[(tempX) * this.size + tempY].innerText = 2;
        }
    }
}

function OutPutManager(size) {
    this.size = size;
    this.output = [];
    this.build();
}
OutPutManager.prototype.availabe = function (x, y) {
    if (this.output[x][y] == 0) {
        return true;
    } else {
        return false;
    }
}
OutPutManager.prototype.build = function () {
    for (var x = 0; x < this.size; x++) {
        var row = this.output[x] = [];
        for (var y = 0; y < this.size; y++) {
            row.push(0);
        }
    }
    this.makeGrid()
}
OutPutManager.prototype.makeGrid = function () {
    var ad = " <div class=\"grid-row\">";
    for (var i = 0; i < this.size; i++) {
        ad = ad + "<div class=\"grid-cell\"></div>"
    }
    ad = ad + "</div>"
    var ad2 = ""
    for (var i = 0; i < this.size; i++) {
        ad2 = ad2 + ad;
    }
    document.getElementsByClassName("grid-container")[0].innerHTML = ad2;
    document.getElementById("game-container").style.height = this.size * 120 + "px";
    document.getElementById("game-container").style.width = this.size * 120 + "px";

}



function KeyManager() {
    this.listen()
}
// 37 : Left 38 : Up 39 :Right 40 : Down
KeyManager.prototype.listen = function () {
    document.addEventListener("keydown", function (event) {
        grid_new=blankGrid();
        var given = blankGrid();
        for (var i = 0; i < given.length; i++) {
            for (var j = 0; j < given.length; j++) {
                given[i][j] = grid[i][j];
            }
        }
        var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
            event.shiftKey;
        if (!modifiers) {
            event.preventDefault();
            var add = false;
            if (event.which == 37) {
                moveLeft(given);
            } else if (event.which == 38) {
                moveUp(given);
            } else if (event.which == 39) {
                moveRight(given);
            } else if (event.which == 40) {
                moveDown(given);
            }
            if (!compare(given, grid_new)) {
                addTile(grid_new);
            }else{
                winOrLose(grid_new)
            }
            for (var i = 0; i < given.length; i++) {
                for (var j = 0; j < given.length; j++) {
                    grid[i][j] = grid_new[i][j];
                }
            }
            updateScore(score);
            drawTile(grid);
        }
    })
}
function winOrLose(given){
    var win=false;
    var lose=true;
    for (var i = 0; i < given.length; i++) {
        for (var j = 0; j < given.length; j++) {
            if(given[i][j]==2048){
                win=true;
            }
            if(given[i][j]==0){
                lose=false;
            }
        }
    }
    if(win){
        alert("승리하셨습니다.")
        document.removeEventListener("keydown")
    }
    if(lose){
        alert("패배하셨습니다.")
        document.removeEventListener("keydown")
    }
}

function drawTile(grid) {
    var rows = document.getElementsByClassName("grid-cell");
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            rows[(i) * grid.length + j].innerText = grid[i][j];
        }
    }
}

function updateScore(score) {
    document.getElementById("score-container").innerText = score;
}

function addTile(grid_new) {
    var add = false;
    while (!add) {
        var prob = Math.random();
        var number = prob > 0.2 ? 2 : 4;
        var tempX = Math.floor(Math.random() * (grid_new.length));
        var tempY = Math.floor(Math.random() * (grid_new.length));
        if (isAvailabe(tempX, tempY)) {
            grid_new[tempX][tempY] = number;
            add = true;
        }
    }
}

function isAvailabe(tempX, tempY) {
    if (grid_new[tempX][tempY] == 0) {
        return true;
    } else {
        return false;
    }
}


function moveLeft(given) {
    var rett=blankGrid();
    for (var i = 0; i < given.length; i++) {
        for (var j = 0; j < given.length; j++) {
            rett[i][j] = given[i][j];
        }
    }
    for (var i = 0; i < given.length; i++) {
        rett[i] = operate(rett[i]);
    }
    for (var i = 0; i < given.length; i++) {
        for (var j = 0; j < given.length; j++) {
            grid_new[i][j] = rett[i][j];
        }
    }
}

function moveRight(given) {
    var reverse = reverRightLeft(given);
    for (var i = 0; i < reverse.length; i++) {
        reverse[i] = operate(reverse[i]);
    }
    var rollBack = reverRightLeft(reverse);
    for (var i = 0; i < rollBack.length; i++) {
        for (var j = 0; j < rollBack.length; j++) {
            grid_new[i][j] = rollBack[i][j];
        }
    }
}


function moveUp(given) {
    var flip = flipGrid(given);
    var reverseFlip = reverRightLeft(flip);
    for (var i = 0; i < given.length; i++) {
        reverseFlip[i] = operate(reverseFlip[i]);
    }
    var rollBack = reverRightLeft(reverseFlip);
    var rettt = flipGrid(rollBack);
    for (var i = 0; i < rettt.length; i++) {
        for (var j = 0; j < rettt.length; j++) {
            grid_new[i][j] = rettt[i][j];
        }
    }
}

function flipGrid(given) {
    var newGrid = blankGrid();
    for (let i = 0; i < given.length; i++) {
        for (let j = 0; j < given.length; j++) {
            newGrid[given.length - 1 - i][given.length - 1 - j] = given[j][i];
        }
    }
    return newGrid;
}

function blankGrid() {
    var newGrid = [];
    for (var i = 0; i < grid.length; i++) {
        var temp = [];
        for (var j = 0; j < grid.length; j++) {
            temp.push(0);
        }
        newGrid.push(temp);
    }
    return newGrid;
}

function moveDown(given) {
    var flip = flipGrid(given);
    for (var i = 0; i < given.length; i++) {
        flip[i] = operate(flip[i]);
    }
    var rettt = flipGrid(flip);
    for (var i = 0; i < rettt.length; i++) {
        for (var j = 0; j < rettt.length; j++) {
            grid_new[i][j] = rettt[i][j];
        }
    }
}

function compare(grid, grid_new) {
    var rett = true;
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid.length; j++) {
            if (grid[i][j] != grid_new[i][j]) {
                rett = false;
            }
        }
    }
    return rett;
}

function reverRightLeft(grid) {
    var reverse = [];
    for (var i = 0; i < grid.length; i++) {
        var temp = grid[i];
        var temp2 = [];
        for (var index = temp.length - 1; index >= 0; index--) {
            temp2.push(temp[index]);
        }
        reverse.push(temp2);
    }
    return reverse;
}

function operate(row) {
    row = slide(row);
    row = combine(row);
    row = slide(row);
    return row;
}

function slide(row) {
    var arr = row.filter(val => val);
    var missing = row.length - arr.length;
    var zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);
    return arr;
}

// operating on array itself
function combine(row) {
    for (var i = row.length - 1; i >= 1; i--) {
        var a = row[i];
        var b = row[i - 1];
        if (a == b) {
            row[i] = a + b;
            score += row[i];
            row[i - 1] = 0;
        }
    }
    return row;
}

Array.prototype.fill = function () {
    for (var i = 0; i < this.length; i++) {
        this[i] = 0;
    }
    return this;
}