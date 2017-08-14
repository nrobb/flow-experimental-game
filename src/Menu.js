var DDATest = DDATest || {};

DDATest.Menu = function(game) {

};

DDATest.Menu.prototype.create = function() {
  // show the cursor
  document.getElementById("gameContainer").style.cursor = "default";
  // set the background to white
  this.stage.backgroundColor = "#000000";
  // instructions
  this.add.text(10, 10, '*use the left and right', { font: "22px Arial", fill: "#ffffff", align: "center" });
  this.add.text(10, 35, 'arrows to move', { font: "22px Arial", fill: "#ffffff", align: "center" });
  this.add.text(10, 70, '*catch the falling stars', { font: "22px Arial", fill: "#ffffff", align: "center" });
  this.add.text(10, 105, '*avoid the meteors', { font: "22px Arial", fill: "#ffffff", align: "center" });
  // start button
  this.spacetrek = this.add.text(this.world.centerX, this.world.centerY,
    'CLICK HERE TO START GAME',
    { font: "50px Arial", fill: "#ffffff", align: "center" });
  this.spacetrek.anchor.set(0.5, 0.5);
  this.spacetrek.inputEnabled = true;
  this.spacetrek.events.onInputUp.add(function() {
    //this.enterFullscreen();
    this.state.start('MeteorShower');
  }, this);
};

DDATest.Menu.prototype.enterFullscreen = function() {
  if (this.game.scale.isFullScreen) {
    this.game.scale.stopFullScreen();
  } else {
    this.game.scale.startFullScreen(false);
  }
}
