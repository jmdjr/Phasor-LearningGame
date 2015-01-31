var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-intro', { preload: preload, create: create, render: render, update: update });

function preload() {
    game.load.image('ball', 'images/Ball.png');
    game.load.image('paddle', 'images/Paddle.png');
}

var ball;
var paddle;

function create() {
    game.stage.backgroundColor = '#0020FF';
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    ball = game.add.sprite(400, 200, 'ball');  
    paddle = game.add.sprite(400, 400, 'paddle');
    
    //ball is 66x66
    ball.anchor.set(0.5);
    
    //paddle is 800 x 66
    paddle.anchor.set(0.5);
    
    game.physics.enable([ball, paddle], Phaser.Physics.ARCADE);
    
    ball.body.collideWorldBounds = true;
    ball.body.bounce.y = 0.5;
    ball.body.gravity.y = 500;
    game.camera.follow(ball, Phaser.Camera.FOLLOW_PLATFORMER);
    
    paddle.body.collideWorldBounds = true;
    paddle.inputEnabled = true;
    // paddle.input.start(0, true); // called when inputEnabled is set automatically.
    
    paddle.input.allowHorizontalDrag = false;
    paddle.events.onInputDown.add(chargePaddle);
    paddle.events.onInputUp.add(releasePaddle);
    
}

function render() {
    game.debug.inputInfo(10, 20);
}

function update() {
    game.physics.arcade.collide(ball, paddle, collionHandler, null, this);
}

function collionHandler(a, b) {
    
}

function releasePaddle(target, pointer) {
        
}

function chargePaddle() {
    
}