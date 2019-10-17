const Player = require('../Player');
const HardBlow = require('./skills/HardBlow');

module.exports = class Knight extends Player{
    
    constructor() {
        super();
        this.skills = {
            "hard_blow": new HardBlow,
        }
        this.slots = {
            slot_a: "hard_blow"
        }
    }

}