const Serialize = require('php-serialize'); 
const EventEmitter = require('events');

class Noderavel extends EventEmitter {
    constructor ({ driver = 'redis', client, scope = {}, queue = 'default' }) {
        super();
        this.driver = driver;
        this.client = client;
        this.scope = scope;
        this.queue = queue;
    }

    listen () {
        switch (this.driver) {
            case 'redis':
                this.redisPop();
                break;
        }
    }


    push (name, object) {
        switch (this.driver) {
            case 'redis':
                this.redisPush(name, object);
                break;
        }
    }

    redisPop () { 
        const pop = () => {
            this.client.blpop('queues:' + this.queue, 60000, (err, replay) => {
                if (err) {
                    // Error!
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

    redisPush (name, object) {
        const command = Serialize.serialize(object, this.scope);
        let data = {
            job: 'Illuminate\\Queue\\CallQueuedHandler@call',
            data: {
                commandName: name,
                command
            },
            id: Date.now(),
            attempts: 1
        };

        this.client.rpush('queues:' + this.queue, JSON.stringify(data), (err, replay) => {
            // Queue pushed
        });

    }

}

module.exports = Noderavel;