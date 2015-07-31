var format = require('util').format;

// Somewhere around here is when we started on the new non-XUL Fennec
var fennecStartDate = new Date('9/1/2011');
var yearsSince = Math.round((new Date().getTime() - fennecStartDate.getTime()) / 1000 / 60 / 60 / 24 / 365);

const INSULT_LIST = [
  "Why do we let you work here?",
  "Software is hard. Especially for you.",
  "Go away.",
  "Don't you have some IME bugs to fix?",
  "You probably like mercurial. Like Brad.",
  "Shouldn't you be testing on a tablet?",
  "No.",
  "Yes?",
  "Sure, why not.",
  "Assign it to mfinkle",
  "Ask blassey",
  "Did you push it to Try?",
  "No idea.",
  "Don't care.",
  "You're the best!",
  "undefined",
  "null",
  "NaN",
  "You're muted.",
  "Sorry, you voiped out there.",
  "Can you please mute?",
  format('How do we still have this problem after %d years?', yearsSince)
];

function pickInsult() {
  return INSULT_LIST[Math.floor(Math.random() * INSULT_LIST.length)];
}

module.exports.say = function(bot, to, from) {
  bot.say(to, from + ": " + pickInsult());
}

module.exports.pickInsult = pickInsult;

