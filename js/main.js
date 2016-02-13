var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'assets/fairy3.png', 40, 30);  
    game.load.image('background', 'assets/forest.png');
    game.load.spritesheet('target', 'assets/fireSM.png', 40, 68);
    game.load.image('bullet', 'assets/shmup-bullet2.png');            
    game.load.image('win', 'assets/yay.png');
    game.load.audio('fire',  'assets/blaster.mp3');
    game.load.audio('grassland', 'assets/forestMusic.mp3'); 
    game.load.audio('explode', 'assets/explode1.wav');
    game.load.audio('burn', 'assets/burn.wav');
    game.load.audio('winMusic', 'asserts/win.mp3');
    game.load.image('stone', 'assets/water.png');
    game.load.image('talk', 'assets/talk.png');
    game.load.spritesheet('FireballL', 'assets/FireballL.png', 48, 15);
    game.load.spritesheet('FireballU', 'assets/FireballU.png', 17, 32);
    game.load.image('smoke', 'assets/smoke.png');
    game.load.image('gem', 'assets/gem.png');


} 

var win = false;
var lose = false;
var targetsGone = false;
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
var targetCount = 10;
var fire;
var music;
var explode;
var emitter;
var greymon;
var text;
var scoreboard;
var burn;
var lives = 10;
var gem;
var target1;
var target2;
var target3;
var target4;
var target5;
var target6;
var target7;
var target8;
var target9;
var target10;
var anim;
var rain;
var winMusic;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    bg = game.add.tileSprite(0, 0, 800, 600, 'background'); 
    
    //Timer
    // game.time.events.add(Phaser.Timer.MINUTE * .35, youLose, this); 
      
    //Adding targets
    targets = game.add.group();
    targets.enableBody = true;
    targets.physicsBodyType = Phaser.Physics.ARCADE;
    
    //Life counter
    scoreboard = game.add.text(600, 18, "Lives: ", {font: "bold 20px Arial", fill: "#fff"});
    game.add.text(20, 18, "Put out the fires with spacebar!", {font: "bold 20px Arial", fill: "#fff"});
    
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('stone');
    emitter.gravity = 200;
    
    emitter2 = game.add.emitter(0, 0, 1);
    emitter2.makeParticles('smoke');
    emitter2.gravity = -400; 
    
    //Sound Effects
    fire = game.add.audio('fire');
    burn = game.add.audio('burn');
    winMusic = game.add.audio('winMusic');
    fire.volume = -.5;
    music = game.add.audio('grassland');
    music.play();
    explode = game.add.audio('explode');
    
    //Creating fireballs
    fireballs = game.add.group();
    fireballs.enableBody = true;
    fireballs.physicsBodyType = Phaser.Physics.ARCADE;
    
    var fireball1 = fireballs.create(0, 100, 'FireballL');
    fireball1.body.immovable = true;
    fireball1.body.moves = false;
    fireball1.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF1 = this.add.tween(fireball1).to( { x: 200}, 2000, "Linear", true, 0, false);
    fireball1.animations.play('move');
    fireball1.scale.x = -1;
    tweenF1.yoyo(true, 0);
    
    var fireball2 = fireballs.create(400, 300, 'FireballU');
    fireball2.body.immovable = true;
    fireball2.body.moves = false;
    fireball2.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF2 = this.add.tween(fireball2).to( { y: 600}, 2000, "Linear", true, 0, false);
    fireball2.animations.play('move');
    tweenF2.yoyo(true, 0);
    
    var fireball3 = fireballs.create(-60, 400, 'FireballL');
    fireball3.body.immovable = true;
    fireball3.body.moves = false;
    fireball3.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF3 = this.add.tween(fireball3).to( { x: 200}, 1000, "Linear", true, 0, false);
    fireball3.scale.x = -1;
    fireball3.animations.play('move');
    tweenF3.yoyo(true, 0);
    
    var fireball4 = fireballs.create(600, -100, 'FireballU');
    fireball4.body.immovable = true;
    fireball4.body.moves = false;
    fireball4.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF4 = this.add.tween(fireball4).to( { y: 300}, 2100, "Linear", true, 0, false);
    fireball4.animations.play('move');
    fireball4.scale.y = -1;
    tweenF4.yoyo(true, 0);
    
    var fireball5 = fireballs.create(600, 200, 'FireballL');
    fireball5.body.immovable = true;
    fireball5.body.moves = false;
    fireball5.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF5 = this.add.tween(fireball5).to( { x: 200}, 2000, "Linear", true, 0, false);
    fireball5.animations.play('move');
    tweenF5.yoyo(true, 0);
    
    var fireball6 = fireballs.create(700, 400, 'FireballL');
    fireball6.body.immovable = true;
    fireball6.body.moves = false;
    fireball6.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF6 = this.add.tween(fireball6).to( { x: 400}, 2000, "Linear", true, 0, false);
    fireball6.animations.play('move');
    tweenF6.yoyo(true, 0);
    
    var fireball7 = fireballs.create(300, -20, 'FireballU');
    fireball7.body.immovable = true;
    fireball7.body.moves = false;
    fireball7.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    var tweenF7 = this.add.tween(fireball7).to( { y: 100}, 600, "Linear", true, 0, false);
    fireball7.animations.play('move');
    fireball7.scale.y = -1;
    tweenF7.yoyo(true, 0);
    
//    var fireball8 = fireballs.create(150, 100, 'FireballU');
//    fireball8.body.immovable = true;
//    fireball8.body.moves = false;
//    fireball8.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
//    var tweenF8 = this.add.tween(fireball8).to( { y: 300}, 2000, "Linear", true, 0, false);
//    fireball8.animations.play('move');
//    tweenF8.yoyo(true, 0);
    
    ////
    
    target1 = targets.create(200, 400, 'target');
    target1.body.immovable = true;
    target1.body.moves = false;
    target1.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target1.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target1.animations.play('move');
    
    target2 = targets.create(500, 400, 'target');
    target2.body.immovable = true;
    target2.body.moves = false;
    target2.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target2.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target2.animations.play('move');
    
    target3 = targets.create(335, 450, 'target');
    target3.body.immovable = true;
    target3.body.moves = false;
    target3.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target3.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target3.animations.play('move');
    
    target4 = targets.create(20, 200, 'target');
    target4.body.immovable = true;
    target4.body.moves = false;
    target4.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target4.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target4.animations.play('move');
    
    target5 = targets.create(550, 80, 'target');
    target5.body.immovable = true;
    target5.body.moves = false;
    target5.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target5.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target5.animations.play('move');
    
    target6 = targets.create(30, 50, 'target');
    target6.body.immovable = true;
    target6.body.moves = false;
    target6.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim6 = target6.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim6.killOnComplete = true;
    target6.animations.play('move');
    
    target7 = targets.create(200, 100, 'target');
    target7.body.immovable = true;
    target7.body.moves = false;
    target7.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target7.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target7.animations.play('move');
    
    target8 = targets.create(300, 300, 'target');
    target8.body.immovable = true;
    target8.body.moves = false;
    target8.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target8.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target8.animations.play('move');
    
    target9 = targets.create(600, 300, 'target');
    target9.body.immovable = true;
    target9.body.moves = false; target9.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target9.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target9.animations.play('move');
    
    target10 = targets.create(600, 500, 'target');
    target10.body.immovable = true;
    target10.body.moves = false;
    target10.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    anim = target10.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    anim.killOnComplete = true;
    target10.animations.play('move');
    
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

    game.physics.arcade.gravity.y = 300;

    player = game.add.sprite(10, 600, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(.5, .5);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 1000;
    player.body.maxVelocity.y = 500;
   // player.body.setSize(20, 32, 5, 16);

  //  player.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 10, true);
  //  player.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 10, true);
    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.add('fly', [8, 9], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {
    
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(gem, player, gemWin, null, this);
    game.physics.arcade.overlap(bullet, fireballs, bulletFire, null, this);
    game.physics.arcade.overlap(bullets, targets, collisionHandler, null, this);
    game.physics.arcade.overlap(player, fireballs, playerDies, null, this);
    
    scoreboard.text = "Lives: " + lives;
    
    if (lives == 0) {
        youLose();
    }
    
    if (targetCount == 0) {
        if (targetsGone == false && lose == false) {
            gem = game.add.sprite(300, 300, "gem");
            game.physics.enable(gem, Phaser.Physics.ARCADE);
            gem.body.immovable = true;
            gem.body.moves = false;
        }
        targetsGone = true;
    }

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.scale.x = 1;
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.scale.x = -1
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {

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
        player.body.velocity.y = -4000;
        jumpTimer = game.time.now + 500;
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        player.animations.play('fly');
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
    
//    var anim1 = target.animations.add('die', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
//    anim1.killOnComplete = true;
//    anim1.play();
    bullet.kill();
    target.kill();
    explode.play();
    emitter.x = target.position.x;
    emitter.y = target.position.y;
    emitter.start(true, 2000, null, 10);
    targetCount--;
}

function playerDies (player, fireballs) {
    
    burn.play();
    emitter2.x = player.position.x;
    emitter2.y = player.position.y;
    emitter2.start(true, 2000, null, 10);
    player.position.x = 10;
    player.position.y = 800;
    lives--;
    resetTargets();
}

function resetTargets() {
    
    targetCount = 10;
    target1.reset(target1.x, target1.y);
    target2.reset(target2.x, target2.y);
    target3.reset(target3.x, target3.y);
    target4.reset(target4.x, target4.y);
    target5.reset(target5.x, target5.y);
    target6.reset(target6.x, target6.y);
    target7.reset(target7.x, target7.y);
    target8.reset(target8.x, target8.y);
    target9.reset(target9.x, target9.y);
    target10.reset(target10.x, target10.y);
    
}

function gemWin (gem, player) {
    
    gem.kill();
    youWin();
}

function bulletFire (bullet, fireball) {
    
    resetBullet(bullet);
}

function resetBullet (bullet) {

    bullet.kill();

} 

function render() {

    game.debug.text("Shoot the targets with Spacebar!")

}

function youLose() {
    if (win == true) {
        return;
    }
    lose = true;
    var bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 100, 800, 100);

    var style = { font: "bold 32px Arial", fill: "#FE2E2E", boundsAlignH: "center", boundsAlignV: "middle" };

    text = game.add.text(100, 120, "The forest burned down, you're a monster.", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

}

function youWin() {
    winMusic.play();
    if (lose == true) {
        return;
    }
    win = true;
    
      
    rain = game.add.group();
    rain.enableBody = true;
    rain.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < 30; i++) {
        var drop = rain.create(game.rnd.integerInRange(0,600), 0, 'stone');
    }
    
    fireballs.forEach(function(item) {
        item.kill();
                      })

    
    var bar = game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 100, 800, 100);

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    text = game.add.text(250, 120, "You saved the forest!", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    game.add.sprite(300, 200, 'win');

}