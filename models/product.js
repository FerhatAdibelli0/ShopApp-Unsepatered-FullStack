const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    (this.title = title),
      (this.price = price),
      (this.imageUrl = imageUrl),
      (this.description = description);
    this._id = id ? new mongoDb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOP;
    if (this._id) {
      dbOP = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOP = db.collection("products").insertOne(this);
    }
    return dbOP
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByPk(paramId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: mongoDb.ObjectId(paramId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteByPk(paramId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(paramId) })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;

// WİTH SEQUELİZE

// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Product;

// BEFORE SEQUELİZE

// const fs = require("fs");
// const path = require("path");
// const Cart = require("./cart");
// const db = require("../util/database");

// const p = path.join(
//   path.dirname(require.main.filename),
//   "data",
//   "products.json"
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
// getProductsFromFile((products) => {
//   if (this.id) {
//     const updatedIndex = products.findIndex((prod) => prod.id === this.id);
//     let updatedProducts = [...products];
//     updatedProducts[updatedIndex] = this;
//     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//       console.log(err);
//     });
//   } else {
//     this.id = Math.random().toString();
//     getProductsFromFile((products) => {
//       products.push(this);
//       fs.writeFile(p, JSON.stringify(products), (err) => {
//         console.log(err);
//       });
//     });
//   }
// });
//   return db.execute(
//     "INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)",
//     [this.title, this.price, this.description, this.imageUrl]
//   );
// }

// static fetchAll() {
//   // getProductsFromFile(cb);
//   return db.execute("SELECT * FROM products");
// }

// static deleteById(id) {
//   getProductsFromFile((products) => {
//     const product = products.find((prod) => prod.id === id);
//     const updatedProducts = products.filter((p) => p.id !== id);
//     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//       if (!err) {
//         Cart.deleteProduct(id, product.price);
//       }
//     });
//   });
// }

// static findbyId(id) {
// getProductsFromFile((products) => {
//   const product = products.find((p) => p.id === id);
//   cb(product);
// });
//     return db.execute("SELECT * FROM products WHERE products.id=?", [id]);
//   }
// };
