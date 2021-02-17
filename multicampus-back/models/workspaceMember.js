const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class WorkspaceMember extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        loggedInAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        modelName: "WorkspaceMember",
        tableName: "workspacemembers",
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
