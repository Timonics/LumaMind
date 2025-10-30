import { RegisterQueueOptions } from "@nestjs/bullmq";

export class QueueConfigFactory {
  static createQueueConfig(name: string): RegisterQueueOptions {
    return {
      name,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      },
    };
  }
}
