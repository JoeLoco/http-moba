module.exports = class Player {
  constructor() {
    this.id = "";
    this.x = 0;
    this.y = 0;
    this.direction = 'down';
    this.hp = 100;
    this.status = {
      atack: 10,
      defense: 5,
    }
    this.skills = {};
    this.slots = {};
  }

  getSkillBySlot(slot) {
    return this.skills[this.slots[slot]];
  }

  getSkillName(slot) {
    return this.getSkillBySlot(slot).label;
  }

  skillEnabled(slot) {
    return this.getSkillBySlot(slot).enabled();
  }

  useSkill(slot, players) {
    const skill = this.getSkillBySlot(slot);
    skill.use();
    const targets = skill.getTargets(this, players);
    if(targets.length == 0) {
      return;
    }
    const target = targets[0];
    const damage = skill.getDamage("slot_a", player, target);
    target.hp -= damage;
  }

}