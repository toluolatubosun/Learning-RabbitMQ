import amqp from "amqplib";
import express from "express";

const AMQP_URL = "amqp://localhost:5672"
const app = express();

const fibonacci = (n: number): number => {
    if (n === 0 || n === 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

const consumeMessage = async () => {
    const connection = await amqp.connect(AMQP_URL)
    const channel = await connection.createChannel()
    
    const MESSAGE_SEND_QUEUE_NAME = "message_send_queue_name"; // Queue to send messages to, in this case the server is listening to this queue

    channel.assertQueue(MESSAGE_SEND_QUEUE_NAME, { durable: true });
    channel.prefetch(1);
    
    console.log(' [x] Awaiting RPC requests');

    channel.consume(MESSAGE_SEND_QUEUE_NAME, message => {
        if (message) {
            const parsedMessage = JSON.parse(message.content.toString())
            console.log(`Requested from ${parsedMessage.number} fibonacci number`);

            var answer = fibonacci(parseInt(parsedMessage.number));
            console.log(`fibonacci(${parsedMessage.number}) = ${answer}`);

            channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(JSON.stringify({ answer, requested: parsedMessage.number })), 
                { correlationId: message.properties.correlationId }
            );

            console.log(`Sent answer: ${answer}`);

            channel.ack(message)
        }
    });
}

consumeMessage().catch(console.error)

app.listen(8000, () => {
    console.log("Server Listening on PORT 8000");
});