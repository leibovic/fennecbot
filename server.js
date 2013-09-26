var bz = require("bz"),
    irc = require("irc");
var https = require('https');

if (module.parent) {
  return;
}

var bot = new irc.Client("chat.freenode.net", "fennecbot", {
  channels: ["#testchannel123"],
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

// The commented out section is for checking if the URL actually exists
function getRecentWiki(from, to) {

  var path = getPath();

  // var options = {
  //   hostname: 'wiki.mozilla.org',
  //   port: 443,
  //   path: '/Mobile/Notes',
  //   method: 'GET'
  // };

  // var req = https.get(options, function(res) {
  //   console.log("statusCode: ", res.statusCode);
  //   console.log("headers: ", res.headers);

  //   res.on('data', function(chunk) {
  //     var message = from + ": Latest meeting notes: https://wiki.mozilla.org/Mobile/Notes/" + path;
  //     bot.say(to, message);
  //   });
  // });
  // req.end();

  // req.on('error', function(e) {
  //   console.error(e);
  // });

  var message = from + ": Latest meeting notes: https://wiki.mozilla.org/Mobile/Notes/" + path;
  bot.say(to, message);
}

// Get the URI segment for the link
function getPath(){

  var todayDate = new Date();
  var prev = new Date();
  var path;
  var monthShort;

  // If it is already a Wednesday, don't do much
  if (todayDate.getDay() === 3){
    monthShort = MonthMapper(todayDate);
    path = todayDate.getDate() + "-" + monthShort + "-" + todayDate.getFullYear();
    return path;
  }

  else {
    prev.setTime(todayDate);
    while (prev.getDay() !== 3){
      prev = getPrevWed(prev);
    }
  }
  monthShort = MonthMapper(prev);
  path = prev.getDate() + "-" + monthShort + "-" + prev.getFullYear();

  return path;
}

//Map the returned #s to the shorthand month used in the URL
function MonthMapper(date){
  var month = new Array();
  month[0]="Jan";
  month[1]="Feb";
  month[2]="Mar";
  month[3]="Apr";
  month[4]="May";
  month[5]="Jun";
  month[6]="Jul";
  month[7]="Aug";
  month[8]="Sep";
  month[9]="Oct";
  month[10]="Nov";
  month[11]="Dec";
  var monthShort = month[date.getMonth()];

  return monthShort;
}

// Properly formats the date to be an object (instead of the UTC string of numbers)
function getPrevWed(date){
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - 1,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
    );
}

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
    // bot.say(to, "https://wiki.mozilla.org/Mobile/Notes");
   getRecentWiki(from, to);
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
});
