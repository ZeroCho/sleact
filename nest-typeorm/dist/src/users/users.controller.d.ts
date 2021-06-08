import { Users } from '../entities/Users';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: Users): Promise<false | Users>;
    login(user: Users): Promise<Users>;
    join(data: JoinRequestDto): Promise<string>;
    logout(res: any): Promise<any>;
}
