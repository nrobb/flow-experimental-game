var POSM = POSM || {};

POSM.TOO_HARD = 1;

POSM.TOO_EASY = 0;

POSM.LEARNING_RATE = 0.75;

POSM.Posm = function() {

};

POSM.Posm.prototype.init = function(name, values) {
  this[name] = {
    values: values,
    belief: []
  };
  for (var value in values) {
    this[name].belief.push(1);
  }
  this.current = Math.floor(values.length / 2);
  return this[name].values[this.current];
};

/**
 * Posm.prototype.update - finds the just right setting
 *
 * @param  {string} name        the name of the variable the settings are for
 * @param  {string} observation an observation about the diffculty of the current
 *                              setting
 * @return {any}             the new setting
 */
POSM.Posm.prototype.update = function(name, observation) {
  // find A (harder) and B (easier) for each setting
  var harder = [];
  var easier = [];
  for (var setting in this[name].values) {
    // get the total belief of all settings harder than the setting
    var belief = 0;
    for (var i = setting; i < this[name].values.length; i++) {
      belief += this[name].belief[i];
    }
    harder[setting] = belief;
    // get the total belief of all the settings easier than the setting
    var belief = 0;
    for (var j = setting; j >= 0; j--) {
      belief += this[name].belief[j];
    }
    easier[setting] = belief;
  }
  // for each setting, which (easier or harder) has the LEAST total belief
  var settings = [];
  for (var belief in easier) {
    if (easier[belief] <= harder[belief]) {
      settings.push(easier[belief]);
    } else {
      settings.push(harder[belief]);
    }
  }
  // update the belief with the CURRENT index
  this.updateBelief(name, observation);
  // now find which of the settings has the highest belief and update the
  // current index
  var maxBelief = Math.max.apply(null, settings);
  var possibleSettings = [];
  for (var setting in settings) {
    if (settings[setting] === maxBelief) {
      possibleSettings.push(parseInt(setting, 10));
    }
  }
  if (observation = POSM.TOO_HARD) {
    this.current = possibleSettings[0];
  } else {
    this.current = possibleSettings[possibleSettings.length - 1];
  }
  return this[name].values[this.current];
}

/**
 * Posm.prototype.updateBelief - updates the belief of as many settings as possible
 *
 * @param  {string} name        the variable the setting are for
 * @param  {string} observation an observation about the difficulty of the setting
 */
POSM.Posm.prototype.updateBelief = function(name, observation) {
  if (observation === POSM.TOO_HARD) {
    // update the belief of the current setting, and those more difficult
    for (var i = this.current; i < this[name].values.length; i++) {
      this[name].belief[i] *= POSM.LEARNING_RATE;
    }
  } else {
    // update the belief of the current setting, and those less difficult
    for (var i = this.current; i > -1; i--) {
      this[name].belief[i] *= POSM.LEARNING_RATE;
    }
  }
}
