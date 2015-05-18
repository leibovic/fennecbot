var Slack = require('node-slack'),
    config = require("./slack-config");

var slack = new Slack(config.hook_url);

slack.send({
  text: 'Another test',
  channel: '#mobile',
  username: 'fennecbot'
});


