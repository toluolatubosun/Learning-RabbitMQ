import amqp from "amqplib";
import express from "express";

const AMQP_URL = "amqp://localhost:5672"
const app = express();

const consumeMessage = async () => {
    const connection = await amqp.connect(AMQP_URL)

    const channel = await connection.createChannel()
    await channel.assertQueue("my_task_queue", { durable: true })

    channel.prefetch(1); // This tells RabbitMQ not to give more than one message to a worker at a time
    channel.consume("my_task_queue", async (message) => {
        if (message) {
            const parsedMessage = JSON.parse(message.content.toString())
            
            console.log(`Received message: ${parsedMessage.text}`)
            await new Promise((resolve) => setTimeout(resolve, parsedMessage.sleep))
            console.log(`Finished processing message: ${parsedMessage.text}`)

            channel.ack(message)
        }
    })
}

consumeMessage().catch(console.error)

app.listen(process.argv[2] || 8000, () => {
    console.log(`Worker listening on port ${process.argv[2] || 8000}`);
});