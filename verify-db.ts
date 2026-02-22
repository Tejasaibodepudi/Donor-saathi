import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Force load the .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function verify() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in your .env file.');
    process.exit(1);
  }

  console.log(`⏳ Attempting to connect to MongoDB using URI: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('✅ Connection Successful!');

    // Check connection state
    const state = mongoose.connection.readyState;
    console.log(`📌 Mongoose Connection State: ${state === 1 ? 'Connected (1)' : state}`);

    // Ping the collections to prove reading works
    console.log('\n--- Checking Database Seed Counts ---');

    // Dynamically access a few core models configured
    const collections = await mongoose.connection.db?.listCollections().toArray();

    if (collections && collections.length > 0) {
      console.log(`Found ${collections.length} active collections.`);
      for (const col of collections) {
        const count = await mongoose.connection.db?.collection(col.name).countDocuments();
        console.log(`- Collection: [${col.name}]\t\t-> ${count} documents`);
      }
    } else {
      console.log("⚠️ MongoDB is connected, but NO collections were found. Did you run the seed script?");
    }

    console.log('\n✅ Verification Complete.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

verify();
