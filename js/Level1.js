var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'assets/Agumon2.png', 30, 31);
    game.load.image('background', 'assets/sky4.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('platformSM', 'assets/platformSM.png');
    game.load.image('cloud-small', 'assets/cloud-small.png');
    game.load.image('cloud-big-2x', 'assets/cloud-big-2x.png');
    game.load.image('target', 'assets/target.png');
    game.load.image('bullet', 'assets/shmup-bullet.png');
    game.load.image('win', 'assets/yay.png');
    game.load.audio('fire', 'assets/blaster.mp3');
    game.load.audio('grassland', 'assets/grassland.mp3');
    game.load.audio('explode', 'assets/explode1.wav');
    game.load.image('stone', 'assets/stone.png');
    game.load.image('greymon', 'assets/greymonGhost.png');
    game.load.image('talk', 'assets/talk.png');

}

var win = false;
var player;
var facing = 'left';
var cursors;  
var shootButton;
var bg;
var platforms;
var bullet;
var bullets;
var bulletTime = 0;
var jumpTimer = 0;
var targetCount = 6
var fire;
var music;
var explode;
var emitter;
var greymon;
var text;

function create() {
   
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    game.add.sprite(100,100, 'cloud-small');
    game.add.sprite(240, 300, 'cloud-big-2x');
    game.add.sprite(20, 340, 'cloud-small');
    game.add.sprite(370, 70, 'cloud-small');
    game.add.sprite(350, 10, 'greymon');
    game.add.sprite(400, 78, 'cloud-small');
    game.add.sprite(420, 70, 'cloud-small');
    game.add.sprite(290, 40, 'talk');
    
    //Timer
    game.time.events.add(Phaser.Timer.MINUTE * .35, youLose, this);
    
    //Adding targets
    targets = game.add.group();
    targets.enableBody = true;
    targets.physicsBodyType = Phaser.Physics.ARCADE;
    
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('stone');
    emitter.gravity = 200;
    
    //Sound Effects
    fire = game.add.audio('fire');
    fire.volume = -.5;
    music = game.add.audio('grassland');
    music.play();
    explode = game.add.audio('explode');
    
    
    var target = targets.create(0, 550, 'target');
    target.body.immovable = true;
    target.body.moves = false;
    var target = targets.create(500, 400, 'target');
    target.body.immovable = true;
    target.body.moves = false;
    var target = targets.create(335, 450, 'target');
    target.body.immovable = true;
    target.body.moves = false;
    var target = targets.create(20, 200, 'target');
    target.body.immovable = true;
    target.body.moves = false;
    var target = targets.create(550, 80, 'target');
    target.body.immovable = true;
    target.body.moves = false;
    var target = targets.create(30, 50, 'target');
    target.body.immovable = true;
    target.body.moves = false;
    
    //Creating bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    
    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }
    
    //Creating ledges
    platforms = game.add.group();
    platforms.enableBody = true;
    
    var ground = platforms.create(0, game.world.height - 5, 'platform');
    ground.scale.setTo(2,2)
    ground.body.immovable = true;
    ground.body.moves = false;
    
    
    var ledge = platforms.create(400, 530, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(0, 150, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(-300, 488, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(-250, 520, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(100, 335, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(500, 450, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(550, 430, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(550, 410, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(550, 200, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(500, 235, 'platform');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(470, 265, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(500, 30, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    ledge = platforms.create(-400, 420, 'platformSM');
    ledge.body.immovable = true;
    ledge.body.moves = false;
    

    game.physics.arcade.gravity.y = 300;

    player = game.add.sprite(32, 300, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(.5, .5);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
   // player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 10, true);
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {

    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(bullets, targets, collisionHandler, null, this);
    
    if (targetCount == 0) {
        youWin();
    }

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.scale.x = -1;
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.scale.x = 1
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

          //  facing = 'idle';
        }
    }
    
    if (cursors.up.isDown && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -500;
        jumpTimer = game.time.now + 750;
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        fireBullet();
        fire.play();
    }

}

function fireBullet () {
    
    if (game.time.now > bulletTime) 
    {
        bullet = bullets.getFirstExists(false);
        
        if (bullet) 
        {
        bullet.reset(player.x, player.y);
            if (facing == 'right') {
               bullet.body.velocity.x = 600; 
            } else {
               bullet.body.velocity.x = -600;
            }
         bulletTime = game.time.now + 150;
    }
}
}

function collisionHandler (bullet, target) {
    
    bullet.kill();
    target.kill();
    explode.play()
    emitter.x = target.position.x;
    emitter.y = target.position.y;
    emitter.start(true, 2000, null, 10);
    targetCount--;
}

function resetBullet (bullet) {

    bullet.kill();

}

function render() {

    game.debug.text("Shoot the targets with Spacebar!: " + game.time.events.duration, 32, 32);

}

function youLose() {
    if (win == true) {
        return;
    }
    var bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 100, 800, 100);

    var style = { font: "bold 32px Arial", fill: "#FE2E2E", boundsAlignH: "center", boundsAlignV: "middle" };

    text = game.add.text(300, 120, "you lose", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

}

function youWin() {
    win = true;
    var bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 100, 800, 100);

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    text = game.add.text(300, 120, "you win", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    game.add.sprite(300, 200, 'win');

}