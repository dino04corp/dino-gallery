import mongoose from 'mongoose';
import seed from '../seed';
require('dotenv').config({});

const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.gscff.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
async function bootstrap() {
    // await mongoose.connect('mongodb://localhost:27017/mydb');
    await mongoose.connect(uri);

    const shouldSeed = process.env.SEED === 'true';
    if (shouldSeed) {
        await seed();
    }

    await mongoose.disconnect();
    console.log('🌱 Seeding completed');
}

bootstrap();
