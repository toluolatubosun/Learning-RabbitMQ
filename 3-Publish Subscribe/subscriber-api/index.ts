import amqp from "amqplib";
import express from "express";

const AMQP_URL = "amqp://localhost:5672"
const app = express();

const consumeMessage = async () => {
    const connection = await amqp.connect(AMQP_URL)
    const channel = await connection.createChannel()

    const exchangeName = "logs_exchange"
    await channel.assertExchange(exchangeName, "fanout", { durable: true }) // fanout exchange type, sends message to all queues bound to it

    // Create a queue with a random name, and bind it to the exchange
    const queue = await channel.assertQueue("", { exclusive: true }) 
    channel.bindQueue(queue.queue, exchangeName, "")

    // consume messages from the queue
    channel.consume(queue.queue, message => {
        if (message) {
            const parsedMessage = JSON.parse(message.content.toString())
            console.log(`Received message: ${parsedMessage.message}`)
            channel.ack(message)
        }
    })
}

consumeMessage().catch(console.error)

app.listen(process.argv[2] || 8000, () => {
    console.log(`Worker listening on port ${process.argv[2] || 8000}`);
});