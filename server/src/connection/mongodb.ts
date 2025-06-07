import mongoose from 'mongoose';

const connectMongoDB = async () => {
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.gscff.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
  // console.log(`Connecting to MongoDB: ${uri}`);
  try {
    await mongoose.connect(uri, {
      ssl: true,
    });
    // await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
  } catch (error) {
    console.log(`failed to connect database ${error}`);
    process.exit(1);
  }
};

export default connectMongoDB;
