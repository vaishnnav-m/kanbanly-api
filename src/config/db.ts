import mongoose from "mongoose";
import { config } from "./index.js";

export class ConnectDB {
  private _dburi: string;
  constructor() {
    this._dburi = config.database.URI;
  }

  async connect() {
    try {
      await mongoose.connect(this._dburi);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.log(error);
      throw new Error("Database connection failed");
    }
  }
}
