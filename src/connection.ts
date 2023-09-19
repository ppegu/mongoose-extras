import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";

dotenv.config();

const OPTIONS: ConnectOptions = {};

export const MONGO_URI = process.env.MONGO_URI || "";

console.log("MONGO_URI", MONGO_URI);

const connection = {
  isConnected: false,
};

const connect = async () => {
  if (!MONGO_URI) throw new Error("Please set MONGO_URI env variable");

  if (connection.isConnected) {
    console.debug("mongoose already connected.");
    return;
  }

  mongoose.set("strictQuery", true);
  console.debug("connecting mongoose...");
  await mongoose.connect(MONGO_URI, OPTIONS);
  console.debug("mongoose connected.");
  connection.isConnected = true;
};

const close = async () => {
  await mongoose.disconnect();
  console.debug("mongoose disconnected.");
};

const clear = async (name: string) => {
  console.debug("clearing");
  const collections = await mongoose.connection.collections;

  console.debug("collections", collections);
  for (const key in collections) {
    if (name) {
      if (name === key) await collections[key].drop({});
    } else await collections[key].drop({});
  }
};

export default {
  connect,
  close,
  clear,
};
