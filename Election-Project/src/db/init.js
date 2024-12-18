import mongoose from 'mongoose';

export function initDatabase() {
    // Set up the database URL
    //const DATABASE_URL = 'mongodb://localhost:27017/electionsDb'; //(has been edited from this to line 8)

    //Now for our tests to use the correct database, we gonna need to edit the DATABASE_URL variable (actually a constant) to take its value from environment variables
    const DATABASE_URL = process.env.DATABASE_URL

    // Add a listener for connection success
    mongoose.connection.on('open', () => {
        console.info('Successfully connected to the database:', DATABASE_URL);
    });


    // Try connecting to the database
    const connection =  mongoose.connect(DATABASE_URL)
    
    return connection;
}
