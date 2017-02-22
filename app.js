var pm2 = require('pm2');

/*  eslint no-process-exit: "off"                           */

function startApp(appData){
    pm2.connect(function(){
        pm2.start(appData, function(err){
            if (err) {
                return console.error('Error while launching ' + appData.name, err.stack || err);
            } else {
                console.log(appData.name + ' has been succesfully started by PM2');
                return process.exit();
            }
        });
    });
}

startApp({
    "name"      : "DisSpoilerBot",
    "script"    : "index.js",
    "exec_mode" : "fork",
    "instances" : 1,
    "max_memory_restart": "500M",
    "env" : {
        "NODE_ENV" : "development"
    },
    "env_production" : {
        "NODE_ENV" : "production"
    }
});
