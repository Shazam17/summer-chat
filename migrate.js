setTimeout(() => {
  const db = require('./migrations');
  const {User, Dialog, User_Dialog} = db;


  // User.hasMany(User_Dialog)
  Dialog.hasMany(User_Dialog)


  db.sequelize.sync({force: true});
}, 3000);
