"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dotenv_1 = __importDefault(require("dotenv"));
const ChannelChats_1 = require("./src/entities/ChannelChats");
const ChannelMembers_1 = require("./src/entities/ChannelMembers");
const Channels_1 = require("./src/entities/Channels");
const DMs_1 = require("./src/entities/DMs");
const Mentions_1 = require("./src/entities/Mentions");
const Users_1 = require("./src/entities/Users");
const WorkspaceMembers_1 = require("./src/entities/WorkspaceMembers");
const Workspaces_1 = require("./src/entities/Workspaces");
dotenv_1.default.config();
const config = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        ChannelChats_1.ChannelChats,
        ChannelMembers_1.ChannelMembers,
        Channels_1.Channels,
        DMs_1.DMs,
        Mentions_1.Mentions,
        Users_1.Users,
        WorkspaceMembers_1.WorkspaceMembers,
        Workspaces_1.Workspaces,
    ],
    migrations: [__dirname + '/src/migrations/*.ts'],
    cli: { migrationsDir: 'src/migrations' },
    autoLoadEntities: true,
    charset: 'utf8mb4',
    synchronize: false,
    logging: true,
    keepConnectionAlive: true,
};
module.exports = config;
//# sourceMappingURL=ormconfig.js.map