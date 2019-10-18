var _ = require('lodash');

module.exports = class Skill {
  constructor() {
    this.coolDownInSeconds = 0;
    this.usedAt = 0;
  }

  getPositionByDirection(player, distance = 1) {
    if (player.direction == "up") {
      return { x: player.x, y: player.y - distance };
    }
    if (player.direction == "down") {
      return { x: player.x, y: player.y + distance };
    }
    if (player.direction == "left") {
      return { x: player.x - distance, y: player.y };
    }
    if (player.direction == "right") {
      return { x: player.x + distance, y: player.y };
    }
  }

  getTargetByPosition(x, y, players) {
    return _.find(players, (other) => {
      return x == other.x && y == other.y
    });
  }

  use() {
    this.usedAt = new Date().getTime();
  }

  enabled() {
    console.log(new Date().getTime(),this.usedAt, (this.coolDownInSeconds * 1000));
    if ((new Date().getTime() - this.usedAt) > (this.coolDownInSeconds * 1000)) {
      return true;
    }
    return false;  
  }

}