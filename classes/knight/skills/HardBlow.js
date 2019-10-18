const Skill = require('../../Skill');

module.exports = class HardBlow extends Skill {

  constructor() {
    super();
    this.label = "Hard Blow";
    this.coolDownInSeconds = 10;
  }

  getDamage(player, target) {
    return ((player.status.atack * 2) - target.status.defense)
  }

  getTargets(player, others) {
    const { x, y } = this.getPositionByDirection(player);
    const target = this.getTargetByPosition(x, y, others);
    if (target) {
      return [target];
    }
    return [];
  }
}