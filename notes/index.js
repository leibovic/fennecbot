var MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; //Array to convert month num to shorthand
var MEETINGDAY = 3; //Represents day of week of meetings

function getRecent(from, to) {

  var path = getPath();
  var message = from + ": Latest meeting notes: https://wiki.mozilla.org/Mobile/Notes/" + path;
  return message;
}

// Get the URI segment for the link
function getPath() {

  var todayDate = new Date();
  var prev = new Date();
  var path;
  var monthShort;

  // Check if today is is a Wednesday
  if (todayDate.getDay() === MEETINGDAY) {
    monthShort = MONTH[todayDate.getMonth()];
    path = todayDate.getDate() + "-" + monthShort + "-" + todayDate.getFullYear();
    return path;
  }

  else { // Today is not a meeting day
    prev.setTime(todayDate);
    while (prev.getDay() !== MEETINGDAY) { //Loop until prev is the day of meetings
      prev = getPrevDay(prev);
    }
  }
  monthShort = MONTH[prev.getMonth()];
  path = prev.getDate() + "-" + monthShort + "-" + prev.getFullYear();

  return path;
}

// Properly formats the date to be an object (instead of the UTC string of numbers)
function getPrevDay(date) {
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

// TODO
//Helper function to check if a link actually exists
function testLink() {
  var options = {
    hostname: 'wiki.mozilla.org',
    port: 443,
    path: '/Mobile/Notes',
    method: 'GET'
  };

  var req = https.get(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(chunk) {
      var message = from + ": Latest meeting notes: https://wiki.mozilla.org/Mobile/Notes/" + path;
      bot.say(to, message);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}

exports.recent = function(from, to) {
  return getRecent(from, to);
};
