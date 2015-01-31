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
    
    function create() {
        
        this.game.world.setBounds(0, 0, 800, 1000);
        this.game.stage.backgroundColor = '#0020FF';
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        
        
//        var vOff = this.game.world.
        this.ball = this.game.add.sprite(400, 200, 'snooker');  
        this.paddle = this.game.add.sprite(400, 400, 'paddle');
        
        this.leftAnchor = this.game.add.sprite(0, 350, 'snooker');
        this.rightAnchor = this.game.add.sprite(800, 350, 'snooker');
        
        this.mouseBody = new p2.Body();
        
        this.game.physics.p2.gravity.y = 500;
        this.game.physics.p2.restitution = 0.5;

        this.game.physics.enable([this.ball, this.paddle, this.leftAnchor, this.rightAnchor], Phaser.Physics.P2JS);
        
        // add the mouse's body, for collisions.
        this.game.physics.p2.world.addBody(this.mouseBody);
        
        this.ball.body.setCircle(26);
        this.ball.body.mass = 0.5;
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
        //game.debug.inputInfo(10, 20);
        //game.debug.spriteInfo(mouseBody, 254,  20);
    //    game.debug.text('charging paddle!', 10, 110);
    }

    function update() {
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
