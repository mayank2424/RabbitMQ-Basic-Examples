const amqp = require('amqplib/callback_api');

//amqp connection
amqp.connect('amqp://localhost',(e1, conn) => {
   if(e1) throw e1;
   
   conn.createChannel((e2, channel) => {
       if(e2) throw e2;

       var exchange = 'direct_logs';
       var args = process.argv.slice(2);
       var msg = args.slice(1).join(' ') || 'Hello World';
       var severity = (args.length > 0) ? args[0]:  'info';

       channel.assertExchange(exchange, 'direct', {
           durable: false
       })

       channel.publish(exchange, severity, Buffer.from(msg));
       console.log("[x] Sent %s: '%s'", severity, msg);

       setTimeout(() => {
         conn.close();
         process.exit(0)
       }, 500);
   })
})