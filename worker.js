const amqp = require('amqplib/callback_api');

//amqp connection
amqp.connect('amqp://localhost', (e1, conn) => {
    if(e1) {
        throw e1;
    }

    conn.createChannel((e2, channel) => {
        if(e2) {
            throw e2;
        }

        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true            //This is added so that message doesn;t get delete from memeory when rabbit mq server restarts
        })

        channel.prefetch(1);
        console.log('[x] Waiting for messagr to recieve %s', queue);

        channel.consume(queue, (msg) => {
            var sec = msg.content.toString().split('.').length - 1;

            console.log('[x] Received message is %s', msg.content.toString());

            setTimeout(() => {
                console.log('[x] Done');
                channel.ack(msg);
            }, sec * 1000);
        },
        { 
           noAck: false
        })
    })
})