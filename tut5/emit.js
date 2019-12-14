const amqp = require('amqplib/callback_api');

//amqp connection
amqp.connect('amqp://localhost',(e1, conn) => {
   if(e1) throw e1;
   
   conn.createChannel((e2, channel) => {
       if(e2) throw e2;

       var exchange = 'topic_logs';
       var args = process.argv.slice(2);
       var msg = args.slice(1).join(' ') || 'Hello World';
       var key = (args.length > 0) ? args[0] : 'anonymous.info';

       channel.assertExchange(exchange, 'topic', {
           durable: false
       })

       channel.publish(exchange, key, Buffer.from(msg));
       console.log("[x] Sent %s: '%s'", key, msg);

       setTimeout(() => {
         conn.close();
         process.exit(0)
       }, 500);
   })
})