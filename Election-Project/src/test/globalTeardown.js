
export default async function globalTeardown() {
    if (global._MONGOINSTANCE) {
        await global._MONGOINSTANCE.stop();
    } else {
        console.warn("MongoMemoryServer instance not found during teardown.");
    }
}
