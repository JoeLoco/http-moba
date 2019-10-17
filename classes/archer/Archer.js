const Player = require('../Player');
const DoubleHit = require('./skills/DoubleHit');

module.exports = class Knight extends Player{
    
    constructor() {
        super();
        this.class = "archer"        
        this.skills = {
            "double_hit": new DoubleHit(),
        }
        this.slots = {
            slot_a: "double_hit"
        }
    }

}