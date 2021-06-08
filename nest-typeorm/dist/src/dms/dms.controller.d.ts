/// <reference types="multer" />
import { Users } from '../entities/Users';
import { DMsService } from './dms.service';
export declare class DMsController {
    private dmsService;
    constructor(dmsService: DMsService);
    getWorkspaceChannels(url: any, user: Users): Promise<Users[]>;
    getWorkspaceDMChats(url: any, id: number, perPage: number, page: number, user: Users): Promise<import("../entities/DMs").DMs[]>;
    createWorkspaceDMChats(url: any, id: number, content: any, user: Users): Promise<void>;
    createWorkspaceDMImages(url: any, id: number, files: Express.Multer.File[], user: Users): Promise<void>;
    getUnreads(url: any, id: number, after: number, user: Users): Promise<number>;
}
