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
  "Did you push it to Try?"
];

function pickInsult() {
  return INSULT_LIST[Math.round(Math.random() * INSULT_LIST.length) - 1];
}

module.exports.say = function(bot, to, from) {
  bot.say(to, from + ": " + pickInsult());
}

module.exports.pickInsult = pickInsult;