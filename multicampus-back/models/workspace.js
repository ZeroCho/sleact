const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Workspace extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        name: {
          type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        url: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
      },
      {
        modelName: "Workspace",
        tableName: "workspaces",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Workspace.belongsTo(db.User, { as: "Owner", foreignKey: "OwnerId" });
    db.Workspace.belongsToMany(db.User, {
      through: db.WorkspaceMember,
      as: "Members",
    });
    db.Workspace.hasMany(db.Channel);
    db.Workspace.hasMany(db.DM);
  }
};
