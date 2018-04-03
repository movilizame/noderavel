const Serialize = require('php-serialize');
let redis = require('redis');
const EventEmitter = require('events');


class Noderavel extends EventEmitter {
    constructor ({ driver = 'redis', client, scope = {}, queue = 'default' }) {
        super();
        this.driver = driver;
        this.client = client;
        this.scope = scope;
        this.queue = queue;

        switch (this.driver) {
            case 'redis':
                this.redisPop();
                break;
        }
    }

    // connect () {
    //     switch (this.driver) {
    //         case 'redis': 
    //             const redis = require('redis');
    //             const redisHost = this.options.host || '127.0.0.1';
    //             const redisPort = this.options.port || '6379';
    //             this.connection = redis.createClient(redisPort, redisHost); 
    //             break;
    //     }
    // }

    redisPop () { 
        const pop = () => {
            this.client.blpop('queues:' + this.queue, 60000, (err, replay) => {
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