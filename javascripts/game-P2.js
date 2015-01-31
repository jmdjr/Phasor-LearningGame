var gameP2 = new Phaser.Game(800, 600, Phaser.AUTO, 'game-P2', { preload: p2_preload, create: p2_create, render: p2_render, update: p2_update });

function p2_preload() {
    gameP2.load.image('ball', 'images/Ball.png');
    gameP2.load.image('paddle', 'images/Paddle.png');
}

var ball;
var paddle;

function p2_create() {
    gameP2.stage.backgroundColor = '#0020FF';
    
    gameP2.physics.startSystem(Phaser.Physics.P2JS);
    
    ball = gameP2.add.sprite(400, 200, 'ball');  
    paddle = gameP2.add.sprite(400, 400, 'paddle');
    
    //ball is 66x66
    ball.anchor.set(0.5);
    
    //paddle is 800 x 66
    paddle.anchor.set(0.5);
    
    gameP2.physics.enable([ball, paddle], Phaser.Physics.P2JS);
    
/*    ball.body.collideWorldBounds = true;
    ball.body.bounce.y = 0.5;
    ball.body.gravity.y = 500;
    gameP2.camera.follow(ball, Phaser.Camera.FOLLOW_PLATFORMER);
    
    paddle.body.collideWorldBounds = true;
    paddle.inputEnabled = true;
    // paddle.input.start(0, true); // called when inputEnabled is set automatically.
    
    paddle.input.allowHorizontalDrag = false;
    paddle.events.onInputDown.add(chargePaddle);
    paddle.events.onInputUp.add(releasePaddle);*/
    
}

function p2_render() {
    gameP2.debug.inputInfo(10, 20);
}

function p2_update() {
    gameP2.physics.arcade.collide(ball, paddle, collionHandler, null, this);
}

function p2_collionHandler(a, b) {
    
}

function p2_releasePaddle(target, pointer) {
        
}

function p2_chargePaddle() {
    
}