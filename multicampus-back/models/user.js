const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        email: {
          type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Workspace, { as: "Owned", foreignKey: "OwnerId" });
    db.User.belongsToMany(db.Workspace, {
      through: db.WorkspaceMember,
      as: "Workspaces",
    });
    db.User.belongsToMany(db.Channel, { through: "ChannelMembers" });
    db.User.hasMany(db.ChannelChat);
  }
};
