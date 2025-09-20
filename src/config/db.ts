import mongoose from "mongoose";
import { config } from "./index.js";
import logger from "../logger/winston.logger.js";

export class ConnectDB {
  private _dburi: string;
  constructor() {
    this._dburi = config.database.URI;
  }

  async connect() {
    try {
      await mongoose.connect(this._dburi);
      logger.info("MongoDB connected successfully");
    } catch (error) {
      logger.error(error);
      throw new Error("Database connection failed");
    }
  }
}
