jQuery.multipress = function (keys, handler) {
    'use strict';
  
    if (keys.length === 0) {
      return;
    }
  
    var down = {};
    jQuery(document).keydown(function (event) {
      down[event.keyCode] = true;
    }).keyup(function (event) {
      // Copy keys array, build array of pressed keys
      var remaining = keys.slice(0),
        pressed = Object.keys(down).map(function (num) { return parseInt(num, 10); }),
        indexOfKey;
      // Remove pressedKeys from remainingKeys
      jQuery.each(pressed, function (i, key) {
        if (down[key] === true) {
          down[key] = false;
          indexOfKey = remaining.indexOf(key);
          if (indexOfKey > -1) {
            remaining.splice(indexOfKey, 1);
          }
        }
      });
      // If we hit all the keys, fire off handler
      if (remaining.length === 0) {
        event.stopPropagation();
        handler(event);
      }
    });
  };