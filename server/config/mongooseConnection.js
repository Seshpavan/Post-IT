import mongoose from "mongoose";
import {GridFSBucket} from 'mongodb';
// import debug from "debug";
// const dbgr = debug('development:mongooseConnection');

const connectDB = async () => {
    try {
    // await mongoose.connect(`${process.env.Mongo_URI}${process.env.Mongo_PASSWORD}${process.env.DB_LOCATION}`)
    await mongoose.connect(`${process.env.LOCAL_DB}`)
        console.log(("Connected to MongoDB"))
    } catch (err) {
        console.log("Error Connecting to MongoDB", err)
    }
}
const connection = mongoose.connection;

let gfsBucket;
connection.once('open', ()=>{
    gfsBucket = new GridFSBucket(connection.db,{bucketName: 'uploads'});
    console.log('Connected to GridFS');
    
})

export {connectDB, gfsBucket};

