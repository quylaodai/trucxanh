var app = new PIXI.Application(800, 600, { backgroundColor: 0x888888 });
document.body.appendChild(app.view);

var bgImage = new PIXI.Sprite.fromImage("required/assets/basics/trucxanh_bg.jpg");
app.stage.addChild(bgImage);
bgImage.width = 800;
bgImage.height = 600;

/**
 * @creatCards
 */
var cards = [];
for (i = 0; i < 20; i++) {
    let url = "required/assets/basics/trucxanh" + (i % 10) + ".jpg";
    var sprite = PIXI.Sprite.fromImage(url);
    sprite.width = 100;
    sprite.height = 100;
    sprite.value = (i + 1) % 10;
    sprite.x = 0;
    sprite.y = 0;
    cards.push(sprite);
}

function sufferCards() {
    for (i = 0; i < 10; i++) {
        var from = Math.floor(Math.random() * 20);
        var to = Math.floor(Math.random() * 20);
        var tmp = cards[from];
        cards[from] = cards[to];
        cards[to] = tmp;
    }
}

/**
 * @lobby
 * */
var lobbyScreen = new PIXI.Container();
app.stage.addChild(lobbyScreen);

// textScore
var textScore = new PIXI.Text("Score = 100", { fill: 0xffffff });
textScore.x = 30;
textScore.y = 30;
lobbyScreen.addChild(textScore);

// game Button
var gameButton = new PIXI.Text("Play Game", { fontSize: 30, fill: 0xcd0000 });
gameButton.x = 30;
gameButton.y = 65;
gameButton.interactive = true;
gameButton.buttonMode = true;
gameButton.on("click", function () {
    lobbyScreen.visible = false;
    gameScreen.visible = true;
    resetGame();
    creatGame();
});
lobbyScreen.addChild(gameButton);


/**
 *@gameScreen
 */
var gameScreen = new PIXI.Container();
gameScreen.visible = false;
app.stage.addChild(gameScreen);

var scoreText = new PIXI.Text('Score = 100', { fill: 0xffffff });
scoreText.x = 30;
scoreText.y = 30;
gameScreen.addChild(scoreText);

var tryButton = new PIXI.Text("Play Again", { fill: 0xffffff });
gameScreen.addChild(tryButton);
tryButton.interactive = true;
tryButton.buttonMode = true;
tryButton.x = 600;
tryButton.y = 520;
tryButton.visible = false;
tryButton.on("pointerdown", function () {
    tryButton.visible = false;
    backButton.visible = false;
    resetGame();
    creatGame();
});

var backButton = new PIXI.Text("Back", { fill: 0xffffff });
gameScreen.addChild(backButton);
backButton.interactive = true;
backButton.buttonMode = true;
backButton.x = 100;
backButton.y = 520;
backButton.visible = false;
backButton.on("pointerdown", function () {
    lobbyScreen.visible = true;
    gameScreen.visible = false;
    tryButton.visible = false;
    backButton.visible = false;
    resetGame();
});


function resetGame() {
    game.score = 100;
    container = null;
    first = null;
    second = null;
    pick = 0;
    firstItem = null;
    secondItem = null;
    count = 0;
    scoreText.text = "Score = 100";
    victoryPopup.visible = false;
}

/**@effectWin */
app.stage.addChild(victoryPopup);
victoryPopup.visible = false;

function victory() {
    victoryPopup.visible = true;
    gameScreen.removeChild(container);
    // GAME WIN text
    var gameDone = new PIXI.Text("Chúc mừng bạn đạt " + (game.score) + " điểm", { fill: 0xcd0000, fontSize: 50 });
    gameDone.x = 50;
    gameDone.y = 200;
    victoryPopup.addChild(gameDone);
    tryButton.visible = true;
    backButton.visible = true;
}

function loseGame() {
    gameScreen.removeChild(container);
    var gameOver = new PIXI.Text("Ban da that bai!", { fill: 0xcd0000, fontSize: 50 });
    gameOver.x = 200;
    gameOver.y = 200;
    gameOver.visible = false;
    gameScreen.addChild(gameOver);
    tryButton.visible = true;
    backButton.visible = true;
    gameOver.visible = true;
}

// VARS
var count = 0;
var first = null;
var second = null;
var pick = 0;
var firstItem = null;
var secondItem = null;
var items = [];
var container;
var game = { score: 100 };
var gameScore = new Number(100);
console.log(gameScore.value);

function creatGame() {
    playSound(music);
    // sufferCards();
    container = new PIXI.Container();
    container.x = 200;
    container.y = 50;
    gameScreen.addChild(container);

    var items = [];

    for (i = 0; i < 20; i++) {
        // creat items
        var item = new PIXI.Container();
        item.x = 200;
        item.y = 150;
        item.interactive = true;
        item.buttonMode = true;
        items[i] = item;
        item.on("pointerdown", onClickItem);
        // creat tiles
        var tile = cards[i];
        tile.width = 100;
        tile.height = 100;
        tile.y = 100;
        tile.anchor.set(0.5);
        item.addChild(tile);

        // Cover = graphics + index
        var cover = new PIXI.Container();
        cover.pivot.x = 50;
        cover.pivot.y = 50;
        // graphics
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFF3300);
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(0, 100, 100, 100);
        cover.addChild(graphics);
        // index
        var index = new PIXI.Text(i + 1, { fill: 0xffffff });
        index.x = (100 - index.width) / 2;
        index.y = 130;
        cover.addChild(index);
        item.addChild(cover);
    }

    for (i = 19; i >= 0; i--) {
        container.addChild(items[i]);
        TweenMax.fromTo(items[i], 0.2, { alpha: 0 }, { ease: Back.easeOut.config(6), alpha: 1, delay: (20 - i) * 0.1 });
        if (i == 0) {
            TweenMax.fromTo(items[i], 1, { alpha: 0 }, {
                ease: Back.easeOut.config(6),
                alpha: 1,
                delay: (20 - i) * 0.1,
                onComplete: move
            });
        }
    }

    function move() {
        for (i = 0; i < 20; i++) {
            TweenMax.to(items[i], 0.5, {
                ease: Back.easeOut.config(6),
                x: (i % 5) * 100,
                y: Math.floor(i / 5) * 100,
                delay: i * 0.1
            });
        }
    }
}

function openItem(card, callback) {
    playSound(openSound);
    card.children[0].scale.x = 0;
    var tl = new TimeLineMax();
    tl.to(card.children[1].scale, 0.3, { x: 0 })
        .to(card.children[0].scale, 0.3, { x: 0.21 })
        .call(function () {
            if (callback && typeof callback == "function") {
                setTimeout(callback, 1000);
            }
        })
}

function closeItem(card) {
    var tl = new TimeLineMax();
    tl.to(card.children[0].scale, 0.3, { x: 0 })
    to(card.children[1].scale, 0.3, { x: 1 });
}

function scaleItem(x) {
    playSound(match);
    container.setChildIndex(x, 19);
    TweenMax.to(x.children[0].scale, 1, { x: 0.42, y: 0.56 });
}

function updateText() {
    scoreText.text = "Score = " + game.score;
}

function plusScore() {
    TweenLite.to(game, 1, { score: "+=10", roundProps: "score", onUpdate: updateText });
}

function minusScore() {
    TweenLite.to(game, 1, { score: "-=10", roundProps: "score", onUpdate: updateText });
    console.log(game.score);
}

function onClickItem() {
    if (pick == 0) {
        if (!this.isSelected) {
            openItem(this);
            this.isSelected = true;
            first = this.children[0].value;
            firstItem = this;
            pick += 1;
            console.log(first);
        }
    } else if (pick == 1) {
        if (!this.isSelected) {
            openItem(this, check);
            this.isSelected = true;
            second = this.children[0].value;
            secondItem = this;
            console.log(second);
            pick += 1;
        }
    }
}

function check() {
    if (first == second) {
        count += 1;
        plusScore();
        scaleItem(firstItem);
        scaleItem(secondItem);
        if (count == 10)/*GAME WIN*/ {
            playSound(notMatch);
            victory();
        } else {
            first = null;
            second = null;
            setTimeout(function () {
                pick = 0;
                firstItem.visible = false;
                secondItem.visible = false;
            }, 1500);
        }
    } else {
        minusScore();
        if (game.score < 20){
            playSound(music);
            TweenMax.delayCall(loseGame, 1)
        }
        else {
            TweenMax.delayCall(function () {
                closeItem(firstItem);
                closeItem(secondItem);
                playSound(notMatch);
                firstItem.isSelected = false;
                secondItem.isSelected = false;
                first = null;
                second = null;
                pick = 0;
            }, 1)
        }
    }
}
