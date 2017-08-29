var DDATest = DDATest || {};

DDATest.MeteorShower = function(game) {

};

DDATest.MeteorShower.prototype.create = function() {
  // constants
  this.MAX_LEVELS = 20;
  this.STAR_VELOCITY = 10;
  this.LEVEL_DURATION = Phaser.Timer.SECOND * 45;
  this.COUNTDOWN_DURATION = Phaser.Timer.SECOND * 5;
  this.STAR_INTERVAL = Phaser.Timer.SECOND * 5;
  this.DDA_UPDATE_INTERVAL = Phaser.Timer.SECOND * 5;
  this.DDA_UPDATES_PER_LEVEL = this.LEVEL_DURATION / this.DDA_UPDATE_INTERVAL;
  this.STARS_PER_LEVEL = this.LEVEL_DURATION / this.STAR_INTERVAL;
  this.VELOCIIES = [
    200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
    750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1250,
    1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700
  ];
  this.PLAYER_VELOCITY = 10;
  this.OPTIMUM_SUCESS_RATE = 1;
  this.CONTROL_VELOCITY = 700;
  // random seed (ensures all players get same sequence of meteor/star locations)
  Srand.seed(10);
  // juice
  this.juice = this.game.plugins.add(new Phaser.Plugin.Juicy(this));
  // add quit hotkey
  /* var quit = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
  quit.onDown.add(function() {
    this.state.start('Menu');
  }, this);
  */
  // background
  this.add.image(232, -20, 'background');
  //this.starfield = this.add.tileSprite(256, 0, 512, 768, 'starfield');
  // instructions
  this.add.bitmapText(10, 10, 'carrier-command', 'left and right', 10);
  this.add.bitmapText(10, 35, 'carrier-command', 'arrows to move', 10);
  // scoring
  this.score = 0;
  this.highScore = 0;
  this.add.bitmapText(800, 10, 'carrier-command', 'CURRENT SCORE', 12);
  this.add.bitmapText(800, 80, 'carrier-command', 'HIGH SCORE', 12);
  this.displayScore = this.add.bitmapText(800, 30, 'carrier-command', this.score, 16);
  this.displayHighScore = this.add.bitmapText(800, 100, 'carrier-command', this.highScore, 16);
  // betwenn wave text
  this.getReady = this.add.bitmapText(this.world.centerX, this.world.centerY - 15, 'carrier-command',"GET READY!!!", 16);
  this.getReady.anchor.setTo(0.5, 0.5);
  this.waveCountdown = this.add.bitmapText(this.world.centerX, this.world.centerY + 20, 'carrier-command', 3, 20);
  this.waveCountdown.anchor.setTo(0.5, 0.5);
  // hide the cursor
  document.getElementById("gameContainer").style.cursor = "none";
  // physics
  this.physics.startSystem(Phaser.Physics.ARCADE);
  this.velocities = this.VELOCIIES;
  this.velocity = this.velocities[this.velocities.length / 2];
  // wabbit
  this.player = this.add.sprite(this.world.centerX, 700, 'wabbit');
  this.player.anchor.setTo(0.5, 0.5);
  this.physics.enable(this.player, Phaser.Physics.ARCADE);
  // meteor
  this.meteor = this.add.sprite(Srand.randomIntegerIn(0, this.world.width), 20, 'rock');
  this.meteor.animations.add('spin');
  this.meteor.animations.play('spin', 10, true);
  this.meteor.anchor.setTo(0.5, 0.5);
  this.physics.enable(this.meteor, Phaser.Physics.ARCADE);
  this.meteor.kill();
  // meteor emitter
  this.meteorEmitter = this.add.emitter();
  this.meteorEmitter.lifespan = 200;
  this.meteorEmitter.maxParticleScale = 0.1;
  this.meteorEmitter.minParticleScale = 0.25;
  this.meteorEmitter.makeParticles('particle');
  // star
  this.star = this.add.sprite(-50, -50, 'star');
  this.star.anchor.setTo(0.5, 0.5);
  this.physics.enable(this.star, Phaser.Physics.ARCADE);
  this.star.kill();
  // star emitter
  this.starEmitter = this.add.emitter();
  this.starEmitter.lifespan = 200;
  this.starEmitter.maxParticleScale = 0.1;
  this.starEmitter.minParticleScale = 0.25;
  this.starEmitter.makeParticles('star');
  // sound
  this.explosionAudio = this.add.audio('explosion');
  this.collectAudio = this.add.audio('collect-coin');
  this.countdownAudio = this.add.audio('blip');
  this.hurtAudio = this.add.audio('hurt');
  this.music = this.add.audio('music');
  this.music.play(null, null, 0.7, true);
  // cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();
  // counters
  this.numberOfStars = 0;
  this.numberOfBalls = 0;
  this.playerWasHit = 0;
  this.level = 0;
  // experiemental condition
  this.experimentalCondition = this.getExperimentalCondition();
  console.log(this.experimentalCondition)
  // dda
  this.dda = new POSM.Posm();
  // start
  this.setupExperiemt();
};

DDATest.MeteorShower.prototype.update = function() {
  // move the star
  if (this.star.alive) {
    this.star.y += this.STAR_VELOCITY;
  }
  // check if the player caught a star
  if (Phaser.Rectangle.intersects(this.player.getBounds(), this.star.getBounds())) {
    this.collideStar();
  }
  // controls
  if (this.cursors.left.isDown && this.player.x > 256) {
    this.player.x -= this.PLAYER_VELOCITY;
  }
  if (this.cursors.right.isDown && this.player.x < 768) {
    this.player.x += this.PLAYER_VELOCITY;
  }
  // reset the meteor if it's at the bottom
  if (this.meteor.y > this.player.y) {
    this.resetBall();
  }
  // particle effects
  this.meteorEmitter.emitParticle(this.meteor.x, this.meteor.y);
  this.starEmitter.emitParticle(this.star.x, this.star.y);
  // update the score display
  this.displayScore.setText(this.score);
  this.displayHighScore.setText(this.highScore);
};

DDATest.MeteorShower.prototype.collideStar = function() {
  this.score++;
  this.collectAudio.play();
  this.star.reset(-100, -50);
};

DDATest.MeteorShower.prototype.createStar = function() {
  this.numberOfStars++;
  this.star.reset(Srand.randomIntegerIn(256, this.world.width - 256), -50);
  console.log("number of stars this level: " + this.numberOfStars)
};

DDATest.MeteorShower.prototype.resetBall = function() {
  // juice
  this.explosionAudio.play();
  this.juice.shake();
  // score
  if (Phaser.Rectangle.intersects(this.player.getBounds(), this.meteor.getBounds())) {
    this.score = Math.max(this.score -1, 0);
    // audio
    this.hurtAudio.play();
  }
  // adjust the counters
  this.numberOfBalls++;
  if (Phaser.Rectangle.intersects(this.player.getBounds(), this.meteor.getBounds())) {
    this.playerWasHit++;
  }
  this.meteor.kill();
  var x = Srand.randomIntegerIn(256, this.world.width - 256);
  var y = Srand.randomIntegerIn(-50, -10);
  this.meteor.reset(x, y);
  this.physics.arcade.moveToXY(this.meteor, this.player.x, this.player.y, this.velocity);
};

DDATest.MeteorShower.prototype.setVelocity = function() {
  var avoidance = (this.numberOfBalls - this.playerWasHit) / this.numberOfBalls;
  var collection = (this.score / this.numberOfStars);
  if ((avoidance < this.OPTIMUM_SUCESS_RATE) || (collection < this.OPTIMUM_SUCESS_RATE)) {
    console.log("too hard")
    this.velocity = this.dda.update('velocity', POSM.TOO_HARD);
  } else {
    console.log("too easy")
    this.velocity = this.dda.update('velocity', POSM.TOO_EASY);
  }
  this.resetCount();
  console.log("avoidance rate = " + avoidance)
  console.log("collection rate = " + collection)
  console.log("velocity = " + this.velocity)
};

DDATest.MeteorShower.prototype.resetCount = function() {
  this.playerWasHit = 0;
  this.numberOfBalls = 0;
};

DDATest.MeteorShower.prototype.setupExperiemt = function() {
  this.levelInterval();
  switch (this.experimentalCondition) {
    case "control":
      this.velocity = this.CONTROL_VELOCITY;
    break;
    case "DDA":
      this.velocity = this.dda.init('velocity', this.velocities);
      this.setDDAupdate();
    break;
    case "incremental":
      this.velocity = this.velocities[0];
    break;
  }
};

DDATest.MeteorShower.prototype.setScores = function() {
  if (this.score > this.highScore) {
    this.highScore = this.score;
    this.newHighScore();
  }
  this.score = 0;
};

DDATest.MeteorShower.prototype.newHighScore = function() {

};

DDATest.MeteorShower.prototype.runExperiemt = function() {
  this.levelInterval();
  if (this.level === this.MAX_LEVELS) {
    this.endGame();
  }
  switch (this.experimentalCondition) {
    case "control":
    break;
    case "DDA":
      this.setDDAupdate();
    break;
    case "incremental":
      this.incrementDifficulty()
    break;
  }
};

DDATest.MeteorShower.prototype.setDDAupdate = function() {
  if (this.experimentalCondition != "DDA") {
    console.log("not dda game")
    return;
  }
  console.log('reset dda')
  // update velocity
  this.time.events.repeat(this.DDA_UPDATE_INTERVAL,
    this.DDA_UPDATES_PER_LEVEL, this.setVelocity, this);
  // reset the counters
  this.resetCount();
};

DDATest.MeteorShower.prototype.incrementDifficulty = function() {
  // increment velocity
  var index = this.velocities.indexOf(this.velocity) + 1;
  if (index === this.velocities.length) {
    index -= 1;
  }
  this.velocity = this.velocities[index];
};

DDATest.MeteorShower.prototype.showInterLevelInfo = function() {

};

DDATest.MeteorShower.prototype.displayMessages = function() {
  if (this.level === 0) {
    return;
  }
  this.getReady.reset(this.world.centerX, this.world.centerY - 15);
  this.waveCountdown.reset(this.world.centerX, this.world.centerY + 15);
  this.countdownAudio.play();
  this.time.events.add(this.COUNTDOWN_DURATION * 0.25, function countdown() {
    this.countdownAudio.play();
    this.waveCountdown.setText("2");
  }, this);
  this.time.events.add(this.COUNTDOWN_DURATION * 0.5, function countdown() {
    this.waveCountdown.setText("1");
    this.countdownAudio.play();
  }, this);
  this.time.events.add(this.COUNTDOWN_DURATION * 0.75, function countdown() {
    this.waveCountdown.setText("START!!!");
    this.countdownAudio.play();
  }, this);
  this.time.events.add(this.COUNTDOWN_DURATION, function countdown() {
    this.getReady.kill()
    this.waveCountdown.kill()
    this.waveCountdown.setText("3");
  }, this);
};

DDATest.MeteorShower.prototype.levelInterval = function() {
  this.setScores();
  this.level++;
  this.star.kill();
  this.meteor.reset(0, -50);
  this.time.events.removeAll();
  this.time.events.add(this.COUNTDOWN_DURATION, this.startNewLevel, this);
  this.displayMessages();
};

DDATest.MeteorShower.prototype.startNewLevel = function() {
  // add stars
  this.numberOfStars = 0;
  this.time.events.repeat(this.STAR_INTERVAL,
    this.STARS_PER_LEVEL, this.createStar, this);
  // reset the meteors
  this.resetBall();
  console.log("new level! velocity = ", + this.velocity)
  // set the timer to end the level and run the next stage of the experiement
  this.time.events.add(this.LEVEL_DURATION, this.runExperiemt, this);
};

DDATest.MeteorShower.prototype.getExperimentalCondition = function() {
  //return "control";
  return "DDA";
  //return "incremental";
};

DDATest.MeteorShower.prototype.endGame = function() {
  this.music.stop();
  console.log("game over")
};
