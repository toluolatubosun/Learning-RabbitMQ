import amqp from "amqplib";
import express from "express";

const AMQP_URL = "amqp://localhost:5672"
const app = express();

const sendMessages = async () => {
    const connection = await amqp.connect(AMQP_URL)
    const channel = await connection.createChannel()

    const MESSAGE_REPLY_QUEUE_NAME = "message_reply_queue_name"; // Queue to receive messages replies from
    const MESSAGE_SEND_QUEUE_NAME = "message_send_queue_name"; // Queue to send messages to

    var correlationId = Math.random().toString();

    const replyQueue = await channel.assertQueue(MESSAGE_REPLY_QUEUE_NAME, { exclusive: true });

    channel.consume(replyQueue.queue, message => {
        if (message) {
            if (message.properties.correlationId == correlationId) {
                const parsedMessage = JSON.parse(message.content.toString())
                console.log(`Got answer: ${parsedMessage.answer} for ${parsedMessage.requested} fibonacci number`);

                channel.ack(message)
            }
        }
    })

    const numbers = [1, 2, 3, 4];
    for (const number of numbers) {
        console.log(`Requesting for ${number} fibonacci number`)

        channel.sendToQueue(
            MESSAGE_SEND_QUEUE_NAME,
            Buffer.from(JSON.stringify({ number })),
            { correlationId: correlationId, replyTo: replyQueue.queue }
        );

        // sleep for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
}

sendMessages().catch(console.error)

app.listen(8001, () => {
    console.log(`Client listening on port ${process.argv[2] || 8000}`);
});