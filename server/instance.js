var instance = {};

module.exports = {
    set: function(curInstance){
        instance = curInstance;
    },
    attach: function(){
        var Counter = require("server/db/models/Counter/_Counter");
        var serverCounter = new Counter({
            count: 0
        });
        console.log("Server counter: ", serverCounter);
        if (process.env.PRODUCTION) {
            Counter.findOne({production: true}).sort('-created').exec(function(err, counter){
                if (err) console.log("Found error in counter");
                counter.save();
                instance.server.counter = counter;
            })
        } else {
            serverCounter.save();
            instance.server.counter = serverCounter;
        }
    },
    get: function(){
        return instance;
    }
}
