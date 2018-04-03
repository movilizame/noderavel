const Noderavel = require ('./index.js');


let queueWorker = new Noderavel({
    options: {
        host: '172.17.0.5',
        port: 6379
    },
    scope: {
        'STS\\Jobs\\TestJob': class App {}
    }
});

// queueWorker.onJob((c, obj) => {
//     console.log(c, obj);
// });

queueWorker.on('job', ({name, data}) => {
    console.log(name, data);
});