// BEFORE SEQUELİZE , USİNG POOL

// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "Mysql+35",
// });
// module.exports = pool.promise();

// SEQUELİZE CONNECTİON

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize("node-complete", "root", "Mysql+35", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

// CONNECTED WİTH MONGODB DRİVER

// let _db;

// const mongoConnect = () => {
//   const mongodb = require("mongodb");
//   const MongoClient = mongodb.MongoClient;
//   MongoClient.connect(
//     "mongodb+srv://maxpayne35:qGBr7naSXYmEYnw@cluster0.sp51h.mongodb.net/shop?retryWrites=true&w=majority"
//   )
//     .then((client) => {
//       console.log("CONNECTED");
//       _db = client.db();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "Not found that database";
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
