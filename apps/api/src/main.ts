import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupRabbitMQ } from './infra/rabbitmq/rabbitmq.setup';
import { startReindexConsumer } from './search/search.consumer';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 3000);
    await setupRabbitMQ();
    await startReindexConsumer();

    console.log("API running on http://localhost:3000");
}

bootstrap();
