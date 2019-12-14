const amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if(args.length == 0) {
    console.log("Usage: receive.js [info] [warning] [error]");
    process.exit(1);
}
amqp.connect('amqp://localhost', (e1, conn) => {
    if(e1) throw e1;

    conn.createChannel((e2, channel) => {
        if(e2) throw e2;

        var exchange = 'direct_logs';

        channel.assertExchange(exchange, 'direct', {
            durable: false
        })

        channel.assertQueue('', {
            exclusive: true
        }, (e3, q) => {
            if(e3) throw e3;

            console.log("[x] Waiting for logs");

            args.forEach((severity) => {
                channel.bindQueue(q.queue, exchange, severity);
            });

            channel.consume(q.queue, (msg) => {
                console.log("[x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            })
        })
    })
})