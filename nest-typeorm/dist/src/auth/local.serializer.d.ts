import { PassportSerializer } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';
export declare class LocalSerializer extends PassportSerializer {
    private readonly authService;
    private usersRepository;
    constructor(authService: AuthService, usersRepository: Repository<Users>);
    serializeUser(user: Users, done: CallableFunction): void;
    deserializeUser(userId: string, done: CallableFunction): Promise<any>;
}
