import "reflect-metadata";
import Server from "./server";
import { ConnectDB } from "./config/db";

const server = new Server();
const monogo = new ConnectDB();
monogo.connect();

server.start();
