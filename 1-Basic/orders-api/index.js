const amqp = require("amqplib");
const express = require("express");

const app = express();

const AMQP_URL = process.env.AMQP_URL || "amqp://localhost:5672";
const ORDER_DATA = {
    orderId: 6,
    customerId: 4,
    number: "111 222 3333"
};


app.get("/", async (req, res) => {
    const connection = await amqp.connect(AMQP_URL);
    const channel = await connection.createChannel();

    channel.assertQueue("order.shipped", { durable: true });
    channel.sendToQueue("order.shipped", Buffer.from(JSON.stringify(ORDER_DATA)));
});

app.listen(8000, () => {
    console.log("ORDERS API listening on port 8000");
});
