const amqp = require('amqplib');
const express = require("express");
const AMQP_URL = process.env.AMQP_URL || 'amqp://localhost:5672';

const app = express();

async function connect() {
  try {
      const connection = await amqp.connect(AMQP_URL);
      const channel = await connection.createChannel();
      
      await channel.assertQueue("order.shipped");
      channel.consume("order.shipped", (message) => {
          console.log({ message: message.content.toString() });
          channel.ack(message);
      });
    } catch (error) {
        console.log({ error });
    }
}

connect();

app.listen(8001, () => {
    console.log("Listening on PORT 8001");
});