import amqp from "amqplib";

export const connectRabbitMq = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "guest",
      password: "guest",
    });

    const channel = await connection.createChannel();
    console.log("connected to rabbitmq");
  } catch (error) {
    console.log("rabbitmq error", error);
  }
};

export const publishToQueue = async (queueName, message) => {
  try {
    if (!channel) {
      console.error("rabbitmq channel is not initialized");
      return;
    }

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  } catch (error) {
    console.log("error publishing to queue");
  }
};

export const invalidateChacheJob = async (cacheKeys) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    };

    await publishToQueue("cache-invalidation", message);

    console.log("cache invalidation job added to rabbitmq");
  } catch (error) {
    console.log("failed to publish cache on rabbitmq", error);
  }
};
