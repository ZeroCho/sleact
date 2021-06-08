/// <reference types="multer" />
import { Repository } from 'typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { EventsGateway } from '../events/events.gateway';
export declare class DMsService {
    private workspacesRepository;
    private dmsRepository;
    private usersRepository;
    private readonly eventsGateway;
    constructor(workspacesRepository: Repository<Workspaces>, dmsRepository: Repository<DMs>, usersRepository: Repository<Users>, eventsGateway: EventsGateway);
    getWorkspaceDMs(url: string, myId: number): Promise<Users[]>;
    getWorkspaceDMChats(url: string, id: number, myId: number, perPage: number, page: number): Promise<DMs[]>;
    createWorkspaceDMChats(url: string, content: string, id: number, myId: number): Promise<void>;
    createWorkspaceDMImages(url: string, files: Express.Multer.File[], id: number, myId: number): Promise<void>;
    getDMUnreadsCount(url: any, id: any, myId: any, after: any): Promise<number>;
}
