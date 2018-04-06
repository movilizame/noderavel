const Noderavel = require ('./src/index.js');
const redis = require('redis');

const redisHost = 'localhost';
const redisPort = 6379;
redisCliente = redis.createClient(redisPort, redisHost); 

class TestJob {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

let queueWorker = new Noderavel({
    client: redisCliente,
    driver: 'redis',
    scope: {
        'App\\Jobs\\TestJob': TestJob
    }
});

queueWorker.on('job', ({name, data}) => {
    console.log(name, data);
});

queueWorker.listen();
 
 