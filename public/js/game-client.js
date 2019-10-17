
let lastEventTimestamp = 0;
const serverUrl = "http://localhost:5000";

const KEY_DOWN = 83;
const KEY_LEFT = 65;
const KEY_RIGHT = 68;
const KEY_UP = 87;

const KEY_G = 71;
const KEY_H = 72;
const KEY_J = 74;

const buffer = {
  action: "none",
  direction: "down",
}

let gameState = {
  cicle: 1,
  players: [],
  events: [],  
}

let player_id = '';
let player = {}

/* Preload Resources */

const sounds = {
  hard_blow: new Howl({ src: ['../sounds/hard_blow.wav'] }),
  damage: new Howl({ src: ['../sounds/damage.wav'] })
};

function render() {
  const tileSize = 10;
  $("#world").empty();
  for (player of gameState.players) {
    $("#world").append(`<div class='player class-${player.class}' style='top: ${player.y * tileSize};left: ${player.x * tileSize}'></div>`);
  }
  $("#console").empty();

  gameState.events.reverse();
  const events = gameState.events.map((event) => {
    event.tags.map((tag) => {
      if (event.timestamp <= lastEventTimestamp) {
        return;
      }
      sounds[tag].play();
    })
    
    return `${event.timestamp} - ${event.message} - [${event.tags.join(',')}]}`;
  });
  
  $("#console").html(events.join('<br>'));

  if(gameState.events.length > 0) {
    lastEventTimestamp = gameState.events[0].timestamp;
  }
}

function setAction(action, direction) {
  buffer.action = action;
  buffer.direction = direction;
  refreshDebug()
}

function refreshDebug() {

  $("#player-id").html(player.id);
  $("#player-hp").html(player.hp);
  $("#buffer-action").html(buffer.action);
  $("#buffer-direction").html(buffer.direction);
  
}

function update(data) {
  gameState = data;
  player = _.find(gameState.players, {id: player_id})  
  render();
}

function refresh() {
  $.get(`${serverUrl}/load`, function (data) {
    update(data);
  });
}

function sendAction() {
  const data = {
    player_id: player_id,
    action: buffer.action,
    direction: buffer.direction,
  }

  $.ajax({
    url: `${serverUrl}/action`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (data) {
      update(data);
    }
  });
}

function startPolling() {
  setInterval(function () {
    if (buffer.action == "none") {
      refresh();
      return;
    }
    sendAction();
    buffer.action = "none";
    refreshDebug();
  }, 1000);  
}

//#############################################
//# Events
//#############################################

$("#join").click(function () {
  $("#login").hide();
  const data = {
    class: $("#class").val()
  }
  $.ajax({
    url: 'http://localhost:5000/join',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function (player) {
      player_id = player.id;
      startPolling();
    }
  });
});

$.multipress([KEY_UP], function () {
  setAction("move_up", "up");
});

$.multipress([KEY_DOWN], function () {
  setAction("move_down", "down");
});

$.multipress([KEY_LEFT], function () {
  setAction("move_left", "left");
});

$.multipress([KEY_RIGHT], function () {
  setAction("move_right", "right");
});

/* KEY_G + DIRECTIONS */
$.multipress([KEY_UP, KEY_G], function () {
  setAction("use_skill_slot_a", "up");
});

$.multipress([KEY_DOWN, KEY_G], function () {
  setAction("use_skill_slot_a", "down");
});

$.multipress([KEY_LEFT, KEY_G], function () {
  setAction("use_skill_slot_a", "left");
});

$.multipress([KEY_RIGHT, KEY_G], function () {
  setAction("use_skill_slot_a", "right");
});

/* KEY_H + DIRECTIONS */
$.multipress([KEY_UP, KEY_H], function () {
  setAction("use_skill_slot_b", "up");
});

$.multipress([KEY_DOWN, KEY_H], function () {
  setAction("use_skill_slot_b", "down");
});

$.multipress([KEY_LEFT, KEY_H], function () {
  setAction("use_skill_slot_b", "left");
});

$.multipress([KEY_RIGHT, KEY_H], function () {
  setAction("use_skill_slot_b", "right");
});

/* KEY_J + DIRECTIONS */
$.multipress([KEY_UP, KEY_J], function () {
  setAction("use_skill_slot_b", "up");
});

$.multipress([KEY_DOWN, KEY_J], function () {
  setAction("use_skill_slot_b", "down");
});

$.multipress([KEY_LEFT, KEY_J], function () {
  setAction("use_skill_slot_b", "left");
});

$.multipress([KEY_RIGHT, KEY_J], function () {
  setAction("use_skill_slot_b", "right");
});

refresh();