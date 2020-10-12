const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class ChannelChat extends Model {
  static init(sequelize) {
    return super.init({
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT, // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
      },
    }, {
      modelName: 'ChannelChat',
      tableName: 'channelChats',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
      sequelize,
    });
  }
  static associate(db) {
    db.ChannelChat.belongsTo(db.User);
    db.ChannelChat.belongsTo(db.Channel);
  }
};
