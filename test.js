const Noderavel = require ('./index.js');

const redis = require('redis');
const redisHost = '172.17.0.4';
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
        'STS\\Jobs\\TestJob': TestJob
    }
});

queueWorker.on('job', ({name, data}) => {
    console.log(name, data);
});

let job = new TestJob('gato', 10);
queueWorker.listen();
// queueWorker.redisPush('STS\\Jobs\\TestJob', job );