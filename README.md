## Noderavel

Queue sync between NodeJS and Laravel using Redis driver. You can process Jobs dispatched from Laravel in NodeJS or biceversa. 

### Install

```bash
npm install @movilizame/noderavel --save
```

### Usage

* Listen for jobs on NodeJS:

```javascript
const Noderavel = require('Noderavel');
const redis = require('redis');

redisCliente = redis.createClient(6379, 'localhost'); 

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
    // Proccess your jobs here.
});

queueWorker.listen();
```


* Schedule a job to be run in Laravel from NodeJS:

```javascript
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
```

__TestJob__ in Laravel: 

```php
<?php

namespace App\Jobs; 
use Illuminate\Contracts\Queue\ShouldQueue;

class TestJob extends Job implements ShouldQueue
{
    public $a, $b;
    public function __construct ($a, $b) {
        $this->a = $a;
        $this->b = $b;
    }

    function handle () {
        \Log::info('TestJob ' . $this->a . ' '. $this->b);
    }
}

```