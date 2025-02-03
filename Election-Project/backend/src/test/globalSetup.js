import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup(){
    const instance = await MongoMemoryServer.create({
        binary: {
            version: "7.2.0",
        },
    })
    global._MONGOINSTANCE = instance
    process.env.DATABASE_URL = instance.getUri()
}


