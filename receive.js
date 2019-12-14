const amqp = require('amqplib/callback_api');


//ampq Connection
amqp.connect('amqp://localhost', (e, conn) => {
    if(e) {
        throw e;
    }

    //CPonnection setup is same as send client , we open up connectiona nd create a channeland declare the queue from where
    //  we will going to consume

    conn.createChannel((e2, channel) => {
        if(e2) {
            throw e2;
        }

        var queue = 'Hello';


        channel.assertQueue(queue, {
            durable: false
        })


        //
        console.log('[*] Waiting for message to receive %s',  queue);
        channel.consume(queue, function(msg){
            setTimeout(() => {
            console.log(" Receive message is %s", msg.content.toString());  
            }, 2000)
        }, 
        { 
            noAck:true
        })
    })
})