var config = require('./config.js');
var PastebinAPI = require('pastebin-js');
var pastebin;
var paste_level;
var Discord = require('discord.io');
var bot = new Discord.Client({
    token: config.discord_token,
    autorun: true
});

if (config.pastebin_user && config.pastebin_pass){
    pastebin = new PastebinAPI({
        'api_dev_key' : config.pastebin_key,
        'api_user_name' : config.pastebin_user,
        'api_user_password' : config.pastebin_pass
    });
    paste_level = 3;
    console.log('Key and Account Pastebin API created');
} else {
    pastebin = new PastebinAPI(config.pastebin_key);
    paste_level = 0;
    console.log('Key Only Pastebin API created');
}

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ") started!");
});

bot.on('message', function(user, userID, channelID, message, event) {
    var spoiler, spoiler_text, spoiler_title;
    spoiler = message.slice(0,8).toLowerCase();
    if (message.startsWith('*spoilhelp')){
        bot.sendMessage({
            to: channelID,
            message: "`*spoiler [spoiler_title](spoiler_text)`\nor\n`*spoiler spoiler_text`"
        });
    }
    if (spoiler === '*spoiler'){
        spoiler_title = message.match(/\[.*\]/g);
        spoiler_text = message.match(/\(.*\)/g);
        if (spoiler_title && spoiler_text){
            createPaste(spoiler_title[0].slice(1,-1) + ' by ' + user, spoiler_text[0].slice(1,-1), channelID);
        } else {
            createPaste('Untitled by ' + user, message.slice(8).trim(), channelID);
        }
        bot.deleteMessage({
            channelID: channelID,
            messageID: event.d.id
        });
    }
});

function createPaste(title, text, channelID){
    pastebin
        .createPaste(text, title, null, paste_level)
        .then(function (data) {
            sendLink(title, data, channelID);
        })
        .fail(function (err) {
            console.error(err);
        });
}

function sendLink(title, id, channelID){
    bot.sendMessage({
        to: channelID,
        message: title + ': http://pastebin.com/raw/' + id
    });
}
