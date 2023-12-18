# Learning Rabbit MQ

I followed the rabbit MQ official tutorial
(Tutorial)[https://www.rabbitmq.com/getstarted.html]

## Notes

Start Docker Container for RabbitMQ server
```
docker-compose up
```

Login to RabbitMQ Management Console @ localhost:15672
```
username: guest
password: guest
```

### 2-Worker Queues

Running `2-Worker Queues` example

You can run multiple workers by running the following command in multiple terminals
In multiple terminals run:
```bash
yarn dev 8001
yarn dev 8002
...

```

### 3-Publish Subscribe

Running `3-Publish Subscribe` example

You can run multiple subscribers by running the following command in multiple terminals
In multiple terminals run:
```bash
yarn dev 8001
yarn dev 8002
```