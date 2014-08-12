var bz = require("bz"),
    irc = require("irc"),
    https = require("https"),
    notes = require("./notes"),
    tabletTuesday = require("./tablet_tuesday");
    config = require("./config");

if (module.parent) {
  return;
}

var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels,
  port: config.port,
  secure: config.secure,
});

var bugzilla = bz.createClient();

// Finds a bug that matches the search term, and says it to the person who asked about it.
function findBug(from, to, search) {
  bugzilla.searchBugs({ quicksearch: search }, function(error, bugs) {
    if (error) {
      console.log(error);
      return;
    }

    // Find a random bug from the array.
    var index = Math.floor(Math.random() * bugs.length);
    var bug = bugs[index];
    console.log(bot.nick + " found bug " + bug.id);

    var message = from + ": Try working on bug " + bug.id + " - " + bug.summary + " http://bugzil.la/" + bug.id;
    bot.say(to, message);
  });
}
var pings={};

// Listener for the autopinger
bot.addListener("join",function(channel,who){
  who = who.toLowerCase();
  if (pings[who]) {
   var to = channel;
   if (pings[who].length > 5){
     to = who; // Avoid spam, PM if there are a lot of  pings
   }
   for (i in pings[who]) {
    var tempto = pings[who][i].silent ? who : to; // For messages marked "silent"
    bot.say(tempto, who + ": " + pings[who][i].from + " said " + pings[who][i].message)
   }
   delete pings[who];
  }
});


bot.addListener("message", function(from, to, message) {
  if (message.indexOf(bot.nick) !== 0) {
    return;
  }

  if (message.indexOf("tracking bug") > -1) {
    findBug(from, to, "blocking-fennec:+ @nobody");
    return;
  }

  if (message.indexOf("mentor bug") > -1) {
    findBug(from, to, "prod:android sw:mentor @nobody");
    return;
  }

  if (message.indexOf("help") > -1) {
    bot.say(to, from + ": Try looking at our Get Involved page https://wiki.mozilla.org/Mobile/Get_Involved");
    return;
  }

  if (message.indexOf("triage") > -1) {
    bot.say(to, "https://wiki.mozilla.org/Mobile/Triage");
    return;
  }

  if (message.indexOf("notes") > -1) {
    var recentNotes = notes.recent(from, to);
    bot.say(to, recentNotes);
    return;
  }

  if (message.indexOf("build") > -1) {
    bot.say(to, "https://wiki.mozilla.org/Mobile/Fennec/Android");
    return;
  }

  if (message.indexOf("source") > -1) {
    bot.say(to, "https://github.com/leibovic/fennecbot");
    return;
  }

  if (message.indexOf("devices") > -1) {
    bot.say(to, "https://wiki.mozilla.org/Mobile/Fennec/DeviceList");
    return;
  }

  if (message.indexOf("ping ") > -1) {
    try {
      var command = message.match(/(ping)(.*)/)[2].trim().match(/([^ ]*) (.*)/);
      pingee = command[1].toLowerCase();
      if (!pings[pingee]) {
        pings[pingee] = [];
      }
      pings[pingee].push({"from": from, "message": command[2], "silent": (message.indexOf("silentping") > -1)});
    } catch(e) {
      bot.say(to,"Please specify a nick and a message")
    }
    return;
  }
});

bot.addListener("error", function(message) {
  console.log("server error:", message);
});

tabletTuesday.start(bot, config.channels);
