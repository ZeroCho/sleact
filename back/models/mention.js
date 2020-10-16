const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Mention extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        category: {
          type: DataTypes.ENUM("chat", "dm", "system"),
          allowNull: false, // 필수
        },
        chatId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        modelName: "Mention",
        tableName: "mentions",
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Mention.belongsTo(db.Workspace);
    db.Mention.belongsTo(db.User, { as: "Sender", foreignKey: "SenderId" });
    db.Mention.belongsTo(db.User, { as: "Receiver", foreignKey: "ReceiverId" });
  }
};
