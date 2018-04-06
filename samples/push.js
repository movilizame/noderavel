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

for (let i = 0; i < 10; i++) {
    let job = new TestJob('param1', i);
    queueWorker.redisPush('App\\Jobs\\TestJob', job);
}