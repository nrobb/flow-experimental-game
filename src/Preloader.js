var DDATest = {};

DDATest.Preloader = function(game) {

};

DDATest.Preloader.prototype.preload = function() {
  // Sprites
  this.load.image('player-sprite', 'assets/player-sprite.png');
  this.load.image('particle', 'assets/small-circle.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('background', 'assets/background.png'); //560*768
  this.load.spritesheet('rock', 'assets/rock.png', 64, 64);
  // Bitmap font
  this.load.bitmapFont('carrier-command', 'assets/fonts/carrier-command.png',
    'assets/fonts/carrier-command.xml');
  // Audio
  this.load.audio('collect-coin', [
    'assets/collect-coin.mp3',
    'assets/collect-coin.ogg',
    'assets/collect-coin.m4a'
  ])
  this.load.audio('explosion', [
    'assets/explosion.mp3',
    'assets/explosion.ogg',
    'assets/explosion.m4a'
  ])
  this.load.audio('hurt', [
    'assets/hurt.mp3',
    'assets/hurt.ogg',
    'assets/hurt.m4a'
  ])
  this.load.audio('music', [
    'assets/8-Bit-Mayhem.mp3',
    'assets/8-Bit-Mayhem.ogg',
    'assets/8-Bit-Mayhem.m4a'
  ])
  this.load.audio('blip', [
    'assets/blip.mp3',
    'assets/blip.ogg',
    'assets/blip.m4a'
  ]);
  // Background
  this.load.image('starfield', 'assets/starfield.png');
};

DDATest.Preloader.prototype.create = function() {
  this.state.start('Menu');
};
