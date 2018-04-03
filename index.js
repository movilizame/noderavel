const Serialize = require('php-serialize');
let redis = require('redis');
const EventEmitter = require('events');


class Noderavel extends EventEmitter {
    constructor ({ driver = 'redis', options = {}, scope = {}, queue = 'default', timeout = 60000 }) {
        super();
        this.driver = driver;
        this.options = options;
        this.scope = scope;
        this.queue = queue;
        this.timeout = timeout;

        this.proccess();
    }

    connect () {
        switch (this.driver) {
            case 'redis': 
                const redis = require('redis');
                const redisHost = this.options.host || '127.0.0.1';
                const redisPort = this.options.port || '6379';
                this.connection = redis.createClient(redisPort, redisHost); 
                break;
        }
    }

    proccess () {
        if (!this.connection) {
            this.connect();
        }
    
        const pop = () => {
            this.connection.blpop('queues:' + this.queue, this.timeout, (err, replay) => {
                console.log('alog');
                if (err) {
                    console.log('ERROR', err); 
                } else { 
                    let obj = JSON.parse(replay[1]);
                    let command = obj.data.command;
                    let raw = Serialize.unserialize(command, this.scope);
                    this.emit('job', {name: obj.data.commandName, data: raw});
                } 
                pop();
            }); 
        };
    
        pop();
    }

}

module.exports = Noderavel;