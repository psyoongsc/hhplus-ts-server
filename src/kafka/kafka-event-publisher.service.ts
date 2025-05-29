import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaEventPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'ecommerce-server',
      brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
    });
    this.producer = kafka.producer();
  }

  async onModuleInit() {
      await this.producer.connect();
  }

  async onModuleDestroy() {
      await this.producer.disconnect();
  }

  async publish(params: { topic: string; key: string; value: string }) {
    const { topic, key, value } = params;

    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value,
        },
      ],
      timeout: 10000,
    });
  }
}