const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Channel extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        name: {
          type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        private: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        modelName: "Channel",
        tableName: "channels",
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Channel.belongsTo(db.Workspace);
    db.Channel.hasMany(db.ChannelChat, { as: "Chats" });
    db.Channel.belongsToMany(db.User, {
      through: "ChannelMembers",
      as: "Members",
    });
  }
};
