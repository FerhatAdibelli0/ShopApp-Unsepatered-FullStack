const getDb = require("../util/database").getDb;
const mongoDb = require("mongoDb");
const ObjectId = mongoDb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // cart={items:[{}]}
    this._id = _id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex((prd) => {
    //   return prd._id === product._id;
    // });

    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  static findByPk(userId) {
    const db = getDb();
    return db.collection("users").findOne(new ObjectId(userId));
  }
}

module.exports = User;

// WİTH SEQUELİZE

// const Sequelize = require("sequelize");
// const sequalize = require("../util/database");

// const User = sequalize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = User;
