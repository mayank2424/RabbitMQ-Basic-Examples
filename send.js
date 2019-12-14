//Initialize AMPQ Callback API
var amqp = require('amqplib/callback_api');

//Connect to RabbitMQ Server
amqp.connect('amqp://localhost', (err, conn) => {
    if(err) {
        throw err;
    }

    conn.createChannel((error, channel) => {
        if(error) {
            throw error;
        }

        var queue = 'Hello';
        var msg = process.env.msg || 'test';

        channel.assertQueue(queue, {
            durable: false
        })

        channel.sendToQueue(queue, Buffer.from(msg));

        console.log('Message Sent %s', msg);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 500);
    })
})

