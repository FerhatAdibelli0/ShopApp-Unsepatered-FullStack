const getDb = require("../util/database").getDb;
const mongoDb = require("mongoDb");
const ObjectId = mongoDb.ObjectId;

class User {
  constructor(name, email, cart, _id) {
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
    const cartProductIndex = this.cart.items.findIndex((prd) => {
      return prd.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]; // [{},{},{}]

    if (cartProductIndex >= 0) {
      newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const prodId = this.cart.items.map((pd) => {
      return pd.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: prodId } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((qun) => {
              return qun.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });
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
