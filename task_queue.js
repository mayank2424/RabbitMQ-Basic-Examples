const amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', (e1, conn) => {
    if(e1) {
        throw e1;
    }
    conn.createChannel((e2, channel) => {
        if(e2)  {
            throw e2;
        }


        var queue = 'task_queue';
        var msg = process.argv.slice(2).join() || 'Hello Task';

        channel.assertQueue(queue, {
            durable: true
        })

        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        })

        console.log('Message Sent %s', msg);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 500);
    })
})