import amqp from "amqplib";
import express from "express";

const AMQP_URL = "amqp://localhost:5672"
const app = express();

const sendMessage = async () => {
    const connection = await amqp.connect(AMQP_URL)

    const channel = await connection.createChannel()
    await channel.assertQueue("my_task_queue", { durable: true })

    let message = { text: "Hello World 1", sleep: 3000 }
    for (let i = 0; i < 5; i++) {
        channel.sendToQueue("my_task_queue", Buffer.from(JSON.stringify(message)), { persistent: true })
        message.sleep += 2000
        message.text = `Hello World ${i + 2}`
    }
}

sendMessage().catch(console.error)

app.listen(8000, () => {
    console.log("Publisher Listening on PORT 8000");
});