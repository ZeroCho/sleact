import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {Workspaces} from "../../entities/Workspaces";
import {Channels} from "../../entities/Channels";

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const workspacesRepository = dataSource.getRepository(Workspaces);
        await workspacesRepository.insert([{
            id: 1, name: 'Sleact', url: 'sleact'
        }])
        const channelsRepository = dataSource.getRepository(Channels);
        await channelsRepository.insert([{
            id: 1, name: '일반', WorkspaceId: 1, private: false
        }]);
    }
}
