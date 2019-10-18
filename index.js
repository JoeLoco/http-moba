var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');
var uuid = require('uuid');
app.use(bodyParser.json());
app.use(express.static('public'));
const randomInt = require('random-int');
const PlayerFactory = require('./classes/PlayerFactory.js');

//#################################################
//# Skills                                        #
//#################################################

const gameState = {
  cicle: 1,
  players: [],
  events: [],
}

//#################################################
//# Helper Functions                              #
//#################################################

const getPlayerById = (id) => {
  return _.find(gameState.players, (player) => player.id == id);  
}

const getTargetByPosition = (x, y) => {
  return _.find(gameState.players, (other) => {
    return x == other.x && y == other.y
  });  
}

const canMoveTo = (x, y) => {
  return _.findIndex(gameState.players, (other) => {
    return x == other.x && y == other.y
  }) <= 0;
}

const calculateDamage = (skill_slot, player, target) => {
   return  player.skillDamage(skill_slot, target);
}

const getTargets = (skill_slot, player) => {
  return player.getTargets(skill_slot, gameState.players); 
}

const emitEvent = (message, tags = [])=>{
  const event = {
    timestamp: new Date().getTime(),
    message,
    tags
  }

  gameState.events.push(event);
  gameState.events = gameState.events.slice(-20);
  console.log(event); 
}

//#################################################
//# Actions                                       #
//#################################################

const actions = {}

actions["move_down"] = (player, data) => {
  if(canMoveTo(player.x,player.y + 1)) {
    player.y++;
    emitEvent(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["move_up"] = (player, data) => {
  if(canMoveTo(player.x,player.y - 1)) {
    player.y--;
    emitEvent(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["move_left"] = (player, data) => {
  if(canMoveTo(player.x - 1,player.y)) {
    player.x--;
    emitEvent(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["move_right"] = (player, data) => {
  if(canMoveTo(player.x + 1,player.y)) {
    player.x++;
    emitEvent(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["use_skill_slot_a"] = (player) => {
  
  if(!player.skillEnabled("slot_a")) {
    emitEvent(`player ${player.id} can't use ${player.getSkillName("slot_a")}`); 
    return; 
  }

  emitEvent(`player ${player.id} use ${player.getSkillName("slot_a")}`, ['hard_blow']); 
  
  player.useSkill("slot_a", gameState.players);
  
  // emitEvent(`player ${target.id} receive ${damage} damage from ${player.id}`,['damage'])  
}

setInterval(()=>{
  gameState.cicle++;
},1000);

app.get('/load', function(req, res) { 
  res.json(gameState);
});

app.post('/join', function(req, res) { 
  const data = req.body;
  const player = PlayerFactory.build(data.class);
  player.id = uuid.v4();
  player.x = randomInt(0,63); 
  player.y = randomInt(0,27); 
  gameState.players.push(player); 
  res.json(player);
});

app.post('/action', function(req, res) { 
  const data = req.body;
  console.log(data);
  const player = getPlayerById(data.player_id);
  player.direction = data.direction;
  actions[data.action](player);

  res.json(gameState);
});

app.listen(5000);