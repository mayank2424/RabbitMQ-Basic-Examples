const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (e1, conn) => {
    if(e1) throw e1;

    conn.createChannel((e2, channel) => {
        if(e2) throw e2;

        var exchange = 'logs';


        channel.assertExchange(exchange, 'fanout', {
            durable: false
        })

        channel.assertQueue('', {
            exclusive: true
        }, (e3,q) => {
            if(e3) throw e3;

            console.log("[x] Waiting for message to recive %s", q.queue);
            channel.bindQueue(q.queue, exchange, '');

            channel.consume(q.queue, (msg) => {
                if(msg.content) {
                        console.log('[x] Message is: %s', msg.content.toString());
                }
            }, {
                noAck: true
            })
        })
    })
})