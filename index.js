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
    }

    listen () {
        switch (this.driver) {
            case 'redis':
                this.redisPop();
                break;
        }
    }

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


    /**
     * { 
     *      job: 'Illuminate\\Queue\\CallQueuedHandler@call',
     *      data:
     *       { commandName: 'STS\\Jobs\\TestJob',
     *           command: 'O:16:"STS\\Jobs\\TestJob":5:{s:1:"a";s:4:"hola";s:1:"b";i:2;s:10:"connection";s:5:"redis";s:5:"queue";N;s:5:"delay";N;}' 
     *       },
     *       id: 'RV1rVtXMMAwHkYEgJN2Q5K3L9SzFpX4r',
     *       attempts: 1 
     *   }
     */
    redisPush (name, object) {
        const command = Serialize.serialize(object);
        let data = {
            job: 'Illuminate\\Queue\\CallQueuedHandler@call',
            data: {
                commandName: name,
                command
            },
            id: 'asd',
            attempts: 1
        };

        this.client.rpush('queues:' + this.queue, JSON.stringify(data), (err, replay) => {
            console.log(err, replay);
        });
        console.log(data);

    }

}

module.exports = Noderavel;