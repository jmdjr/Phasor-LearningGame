var gamePolish = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-polish', { preload: preload, create: create, render: render, update: update });

    //preloads images, audio and anything else.
    function preload() {
        this.game.load.image('snooker', 'images/snooker.png');
        this.game.load.image('paddle', 'images/Paddle.png');
    }
    
    var ball;
    var paddle, leftAnchor, rightAnchor;
    var mouseBody, mouseConstraint;
    var pauseLabel;
    var backgroundColor = 8447; // #0020FF
    var maxHeight = 0;
    var ballEmitter;
//    var backgroundGradient;
    
    function generateBackgroundHex(digits) {
        return '#' + ("000000" + digits.toString(16)).substr(-6);    
    }
    
    function create() {
        
        this.game.stage.backgroundColor = '#0020FF';
        this.game.world.setBounds(0, -99400, 800, 100000);
//        backgroundGradient = game.add.bitmapData(800, 100000, 'background', true);
//        backgroundGradient.rect(20, 20, 120, 120);
//        backgroundGradient.addToWorld();
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        
        this.ballEmitter = game.add.emitter(400, 200, 0);
        this.ball = this.game.add.sprite(400, 200, 'snooker');  
        this.paddle = this.game.add.sprite(400, 400, 'paddle');
        this.leftAnchor = this.game.add.sprite(0, 350, 'snooker');
        this.rightAnchor = this.game.add.sprite(800, 350, 'snooker');
        
        this.game.camera.follow(this.ball, Phaser.Camera.FOLLOW_TOPDOWN);
        this.mouseBody = new p2.Body();
        
        this.mouseBody.position.x = 400;
        this.mouseBody.position.y = 400;
        
        this.game.physics.p2.gravity.y = 500;
        this.game.physics.p2.restitution = 0.5;

        this.game.physics.enable([this.ball, this.paddle, this.leftAnchor, this.rightAnchor], Phaser.Physics.P2JS);
        
        // add the mouse's body, for collisions.
        this.game.physics.p2.world.addBody(this.mouseBody);
        
        this.ball.body.setCircle(26);
        this.ball.body.mass = 0.5;
        
        this.ballEmitter.makeParticles('snooker');
        this.ballEmitter.start(false, 200, 20);
        
        this.leftAnchor.body.static = true;
        this.leftAnchor.body.clearShapes();
        
        
        this.rightAnchor.body.static = true;
        this.rightAnchor.body.clearShapes();
        
        var restLength = 1, 
            stiffness = 50,
            damping = 1; 
        
        this.game.physics.p2.createSpring(this.paddle, this.leftAnchor, restLength, stiffness, damping, null, null, [350, 0], [0, 0]);
        
        
       this.game.physics.p2.createSpring(this.paddle, this.rightAnchor, restLength, stiffness, damping, null, null, [-350, 0], [0, 0]);

        // mouse's body used for collision detection

        this.game.input.onDown.add(onDown, this);
        this.game.input.onUp.add(onUp, this);
        this.game.input.addMoveCallback(move, this);
        
        // Pause functionality
        this.pauseLabel = this.game.add.text(250, 200, 'Click to Play', {font: '56px Arial', fill: '#fff'});
        this.game.paused = true;
        this.game.input.onDown.add(unpause, this);
    }

    function render() {        
        
        game.debug.text("Max Height:" + maxHeight.toString(10), 20, 40);
        
        var currentHeight = 0;
        if(this.camera.y < -100) {
            currentHeight = Math.abs(this.camera.y);
        }
        else {
            currentHeight = 0;
        }
        game.debug.text("Height:" + currentHeight.toString(10), 20, 20);
    }

    function update() {
//        var grd = backgroundGradient.context.createLinearGradient(0, 20, 0, 120);
//        grd.addColorStop(0, '#8ED6FF');
//        grd.addColorStop(1, '#003BA2');
//        backgroundGradient.context.fillStyle = grd;
//        backgroundGradient.context.fillRect(20, 20, 150, 100);
        
        if(Math.abs(this.world.y) > maxHeight) maxHeight = Math.abs(this.world.y);
        
        if(this.camera.y >= -100) {
            this.ballEmitter.on = false;
        }
        else {
            this.ballEmitter.on = true;
        }
        
        this.ballEmitter.x = this.ball.x;
        this.ballEmitter.y = this.ball.y;
    }

    function onDown(pointer) {
        var bodies = this.game.physics.p2.hitTest(pointer.position, [ this.paddle.body ]);
        var physicsPos = [this.game.physics.p2.pxmi(pointer.position.x), this.game.physics.p2.pxmi(pointer.position.y)];
        
        if(bodies.length) {
            var clickedBody = bodies[0];
            var localPointInBody = [0, 0];
            
            clickedBody.toLocalFrame(localPointInBody, physicsPos);
            
            var newLocal = [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1]) ];
            
            this.mouseConstraint = this.game.physics.p2.createRevoluteConstraint(this.mouseBody, [0,0], clickedBody, newLocal);
        }
    }

    function onUp() {
        this.game.physics.p2.removeConstraint(this.mouseConstraint);
    }

    function move(pointer) {
        this.mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
        this.mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);
    }
    
    function unpause (event){
        game.paused = false;
        this.pauseLabel.visible = game.paused;
    }
}

gamePolish();
