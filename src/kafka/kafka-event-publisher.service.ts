import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaEventPublisherService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private isTestMode: boolean;

  constructor() {
    this.isTestMode = process.env.KAFKA_TEST_MODE === 'true';
  }

  async onModuleInit() {
    if(this.isTestMode) {
      const kafka = new Kafka({
        clientId: 'ecommerce-server',
        brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
      })
      this.producer = kafka.producer();
    } else {
      const kafka = new Kafka({
        clientId: 'ecommerce-server',
        brokers: ['172.19.0.3:9092', '172.19.0.4:9093', '172.19.0.5:9094'],
      });
      this.producer = kafka.producer();
    }

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