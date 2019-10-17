var _ = require('lodash');

module.exports = class Skill {
  constructor() {
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

}