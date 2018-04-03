const Noderavel = require ('./index.js');

const redis = require('redis');
const redisHost = '172.17.0.5';
const redisPort = 6379;
redisCliente = redis.createClient(redisPort, redisHost); 

let queueWorker = new Noderavel({
    client: redisCliente,
    driver: 'redis',
    scope: {
        'STS\\Jobs\\TestJob': class App {}
    }
});

queueWorker.on('job', ({name, data}) => {
    console.log(name, data);
});