var Slack = require('slack-client'),
    config = require("./slack-config");

var slack = new Slack(config.token, true, true);

slack.on('message', function(message) {
  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var user = slack.getUserByID(message.user);

  if (message.type !== 'message' || !message.text || !channel) {
    return;
  }

  if (message.text.indexOf(slack.self.name) !== 0) {
    return;
  }

  var response = user.name + ": Hi!";
  channel.send(response);
  return console.log("@" + slack.self.name + " responded with \"" + response + "\"");
});

slack.on('error', function(error) {
  return console.error("Error: " + error);
});

slack.login();
