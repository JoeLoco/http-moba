var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');
var uuid = require('uuid');
app.use(bodyParser.json());
app.use(express.static('public'));
const randomInt = require('random-int');
const knight = require('./classes/knight/Knight.js');

//#################################################
//# Skills                                        #
//#################################################

const skills = {};

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

const getPlayerSkillBySlot = (skill_slot, player) => {
  return player.getSkillName(skill_slot);
}

const event = (event)=>{
  const format = `${new Date().toISOString()} - ${event}`;
  gameState.events.push(format);
  gameState.events = gameState.events.slice(-20);
  console.log(format); 
}

//#################################################
//# Actions                                       #
//#################################################

const actions = {}

actions["move_down"] = (player, data) => {
  if(canMoveTo(player.x,player.y + 1)) {
    player.y++;
    event(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["move_up"] = (player, data) => {
  if(canMoveTo(player.x,player.y - 1)) {
    player.y--;
    event(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["move_left"] = (player, data) => {
  if(canMoveTo(player.x - 1,player.y)) {
    player.x--;
    event(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["move_right"] = (player, data) => {
  if(canMoveTo(player.x + 1,player.y)) {
    player.x++;
    event(`player '${player.id}' move to ${player.x},${player.y}`); 
  }
}

actions["use_skill_slot_a"] = (player) => {
  event(`player ${player.id} use ${getPlayerSkillBySlot("slot_a",player)}`); 
  const targets = getTargets("slot_a", player);

  if(targets.length == 0) {
    return;
  }
  const target = targets[0];
  const damage = calculateDamage("slot_a", player, target);
  target.hp -= damage;
  event(`player ${target.id} receive ${damage} damage from ${player.id}`)  
}

setInterval(()=>{
  gameState.cicle++;
},1000);

app.get('/load', function(req, res) { 
  res.json(gameState);
});

app.post('/join', function(req, res) { 
  const data = req.body;
  //const player = Object.assign({}, playerBase);
  const player = new knight();
  player.class = data.class;
  player.id = uuid.v4();
  player.x = randomInt(0,63); 
  player.y = randomInt(0,27); 
  gameState.players.push(player); 
  res.json(player);
});

app.post('/ping', function(req, res) { 
  const data = req.body;
  console.log(data);
  const player = getPlayerById(data.player_id);
  player.direction = data.direction;
  actions[data.action](player);

  res.json(gameState);
});

app.listen(5000);