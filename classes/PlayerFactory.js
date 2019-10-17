const Knight = require('./knight/Knight.js');
const Archer = require('./archer/Archer.js');

module.exports = class PlayerFactory{

    static build(playerClass) {
        if(playerClass=="knight") {
            return new Knight();       
        }
        if(playerClass=="archer") {
            return new Archer();       
        }
    }

}