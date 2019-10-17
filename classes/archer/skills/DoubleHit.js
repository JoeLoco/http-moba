const Skill = require('../../Skill');

module.exports = class DoubleHit extends Skill{
    
    constructor() {
        super();
        this.label = "Double Hit";
    }

    getDamage(player, target) {
      return ((player.status.atack * 2 ) - target.status.defense)
    }

    getTargets(player, others) {
      const {x,y} = this.getPositionByDirection(player);
      const target = this.getTargetByPosition(x, y, others);
      if(target) {
          return [target];
      }
      return [];
    }    
}