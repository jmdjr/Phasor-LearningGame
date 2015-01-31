var gameP2 = new Phaser.Game(800, 600, Phaser.AUTO, 'game-P2', { preload: p2_preload, create: p2_create, render: p2_render, update: p2_update });

function p2_preload() {
    gameP2.load.image('ball', 'images/Ball.png');
    gameP2.load.image('paddle', 'images/Paddle.png');
}

var ball_p2;
var paddle_p2, leftAnchor, rightAnchor;
var mouseBody, mouseSpring;

function p2_create() {
    gameP2.stage.backgroundColor = '#0020FF';
    
    gameP2.physics.startSystem(Phaser.Physics.P2JS);
    
    ball_p2 = gameP2.add.sprite(400, 200, 'ball');  
    paddle_p2 = gameP2.add.sprite(400, 400, 'paddle');
    leftAnchor = gameP2.add.sprite(0, 350, 'ball');
    rightAnchor = gameP2.add.sprite(800, 350, 'ball');
    mouseBody = gameP2.add.sprite(0, 0, 'ball');
    
    gameP2.physics.p2.gravity.y = 500;
    gameP2.physics.p2.restitution = 0.5;
    
    gameP2.physics.enable([ball_p2, paddle_p2, leftAnchor, rightAnchor, mouseBody], Phaser.Physics.P2JS);
    
    ball_p2.body.setCircle(33);
    ball_p2.body.mass = 0.5;
    
    leftAnchor.body.static = true;
    leftAnchor.visible = false;
    gameP2.physics.p2.createSpring(paddle_p2, leftAnchor, 10, 20, 0, null, null, [400, 0]);
    
    rightAnchor.body.static = true;
    rightAnchor.visible = false;
    gameP2.physics.p2.createSpring(paddle_p2, rightAnchor, 10, 20, 0, null, null, [-400, 0]);
    
    // mouse's body used for collision detection
    mouseBody.body.static = true;
    mouseBody.body.data.shapes[0].sensor = true;
    mouseBody.visible = false;
    
    
    gameP2.input.onDown.add(p2_onDown, this);
    gameP2.input.onUp.add(p2_onUp, this);
    gameP2.input.addMoveCallback(p2_move, this);
    
    
}

function p2_render() {
    gameP2.debug.inputInfo(10, 20);
//    gameP2.debug.text('charging paddle!', 10, 110);
}

function p2_update() {
}

function p2_onDown(pointer) {
    var bodies = gameP2.physics.p2.hitTest(pointer.position, [ paddle_p2.body ]);
    
    if(bodies.length) {
        mouseSpring = gameP2.physics.p2.createSpring(mouseBody, bodies[0], 0, 100, 1);
    }
}

function p2_onUp() {
    gameP2.physics.p2.removeSpring(mouseSpring);
}

function p2_move(pointer, x, y, isDown) {
    mouseBody.body.x = x;
    mouseBody.body.y = y;
}
