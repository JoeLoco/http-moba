module.exports = class Player{
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

    skillDamage(slot, target) {
        return this.skills[this.slots[slot]].getDamage(this, target);       
    }

    getTargets(slot, others) {
        return this.skills[this.slots[slot]].getTargets(this, others);       
    }

    getSkillName(slot) {
        return this.skills[this.slots[slot]].label;       
    }
}