const dotenv = require('dotenv');
dotenv.config();

const { Sequelize, Model, DataTypes } = require("sequelize");

const url = process.env.DATABASE_URL;

const sequelize = new Sequelize(url);
sequelize.authenticate().then(console.log);
const User = sequelize.define('users', {
  externalId: {
    type: DataTypes.STRING,
  }
});

const Message = sequelize.define('messages', {
  text: {
    type: DataTypes.STRING,
  },
  is_outgoing: {
    type: DataTypes.BOOLEAN,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  chat_id: {
    type: DataTypes.INTEGER,
  },
});

const Dialog = sequelize.define('Dialog', {
  title: {
    type: DataTypes.STRING
  }
});

const User_Dialog = sequelize.define('User_Dialog',{
  user_id: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: User,
    //   key: 'id'
    // }
  },
  dialog_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Dialog,
      key: 'id'
    }
  },
})


module.exports = {
  sequelize,
  User,
  Message,
  Dialog,
  User_Dialog
};
