import mongoose from 'mongoose';
import seed from '../seed';

async function bootstrap() {
    await mongoose.connect('mongodb://localhost:27017/mydb');

    const shouldSeed = process.env.SEED === 'true';
    if (shouldSeed) {
        await seed();
    }

    // Start server here...
}

bootstrap();
