import mongoose from 'mongoose';
import 'dotenv/config';

export function dbConnect() {
  const user = process.env.USER_DB;
  const pasword = process.env.PASSWORD_DB;
  const cluster = 'cluster0.a4xpomk.mongodb.net';
  const dataBase = 'FinalProyect';
  const uri = `mongodb+srv://${user}:${pasword}@${cluster}/${dataBase}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
}
