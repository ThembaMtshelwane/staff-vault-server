import mongoose, { Connection } from "mongoose";
import multer from "multer";;
import { MONGO_URI } from "../constants/env.const";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

// const uploadsDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage });

const db: Connection = mongoose.connection;
const bucket = db.db
  ? new mongoose.mongo.GridFSBucket(db.db, {
      bucketName: "fs",
    })
  : null;

export default connectDB;
export { upload, bucket };
