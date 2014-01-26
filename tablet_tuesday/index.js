var repeat = require("repeat");

var LOGTAG = "Tablet Tuesday:";

var TUESDAY = 2; // 0 is Sunday, via Date.prototype.getDay().

var MESSAGE = "Have you tested on tablet recently? Did you know that today " +
    "is Tablet Tuesday? You should give it a shot!";

var bot, channels;

function start(bot, channels) {
  var millisUntilTuesday, now;

  // TODO: I'm a bad and lazy programmer.
  global.bot = bot;
  global.channels = channels;

  now = new Date();
  millisUntilTuesday = getMillisUntilDayOfWeek(TUESDAY, now);
  console.log(LOGTAG, "Initial start on",
      new Date(now.getTime() + millisUntilTuesday));

  // TODO: Compensate for starting ON Tues (i.e. don't wait until next Tues).
  repeat(startTabletTuesday)
    .every(24 * 7, "hours")
    .start.in(millisUntilTuesday, "ms")
    .then(function () {}, function () {}, function () {
      log("Begin");
    });
}

function startTabletTuesday() {
  repeat(sayTabletTuesday)
    .every(1, "hour")
    .for(24, "hours")
    .start.now()
    .then(function () {
      log("Fin");
    }, function () {}, function () {
      log("Tick");
    });
}

function sayTabletTuesday() {
  global.channels.forEach(function (channel) {
    global.bot.say(channel, MESSAGE);
  });
}

/**
 * Returns millis until 00:00 of the given day of the week where Sunday is 0.
 * If today is the given day of the week but that time has passed, the millis
 * until next week's date will be returned.
 */
function getMillisUntilDayOfWeek(targetDayOfWeek, now) {
  var targetDate;

  if (now.getDay() >= targetDayOfWeek) {
    targetDayOfWeek += 7;
  }

  targetDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (targetDayOfWeek - now.getDay()),
      0 /* hours */,
      0 /* minutes */,
      0 /* seconds */,
      0 /* millis */);
  return targetDate.getTime() - now.getTime();
}

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.log(LOGTAG, args.join(" "), "("+ new Date() + ")");
}

// TODO: JANE, STOP THIS CRAZY THING!
exports.start = start;
