import amqp from "amqplib";
import express from "express";

const AMQP_URL = "amqp://localhost:5672"
const app = express();

const sendMessage = async () => {
    const connection = await amqp.connect(AMQP_URL)
    const channel = await connection.createChannel()

    const exchangeName = "logs_exchange"
    const message = JSON.stringify({ message: "Hello Subscriber!!" })
    
    await channel.assertExchange("logs_exchange", "fanout", { durable: true }) // fanout exchange type, sends message to all queues bound to it
    channel.publish(exchangeName, "", Buffer.from(message)) // publish a message to an exchange. empty string as second argument means we are sending to an exchange not a specific queue

    console.log(`Sent \"${message}\" to exchange`)
}

sendMessage().catch(console.error)

app.listen(8000, () => {
    console.log("Publisher Listening on PORT 8000");
});