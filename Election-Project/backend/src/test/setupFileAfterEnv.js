import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach } from '@jest/globals'
import { initDatabase } from '../db/init'

beforeAll(async ()=>{
    await initDatabase()
})

afterAll(async () => {
    //await mongoose.disconnect() I figured the second one might be more reliable
    await mongoose.connection.close()
})


afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});
