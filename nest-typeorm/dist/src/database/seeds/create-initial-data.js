"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialData = void 0;
const Channels_1 = require("../../entities/Channels");
const Workspaces_1 = require("../../entities/Workspaces");
class CreateInitialData {
    async run(factory, connection) {
        await connection
            .createQueryBuilder()
            .insert()
            .into(Workspaces_1.Workspaces)
            .values([{ id: 1, name: 'Sleact', url: 'sleact' }])
            .execute();
        await connection
            .createQueryBuilder()
            .insert()
            .into(Channels_1.Channels)
            .values([{ id: 1, name: '일반', WorkspaceId: 1, private: false }])
            .execute();
    }
}
exports.CreateInitialData = CreateInitialData;
//# sourceMappingURL=create-initial-data.js.map