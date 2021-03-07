const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(productId, productPrice) {
    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      if (!cart.products.length) {
        cart.products = [{ productId, quantity: 1 }];
      } else {
        // Analyze the cart => find existing product
        const existingProductIndex = cart.products.findIndex(
          (prod) => prod.productId === productId
        );
        const existingProduct = cart.products[existingProductIndex];
        // Add new product / increase quantity
        if (!existingProduct) {
          cart.products = [...cart.products, { productId, quantity: 1 }];
        } else {
          existingProduct.quantity += 1;
        }
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) throw err;
      });
    });
  }

  static deleteProduct(productId, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) throw err;
      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };

      const deletedProduct = updatedCart.products.find(
        (prod) => prod.id === productId
      );

      if (!deletedProduct) {
        return;
      }

      const deletedProductQty = deletedProduct.quantity;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== productId
      );

      updatedCart.totalPrice =
        updatedCart.totalPrice - deletedProductQty * productPrice;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) throw err;
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb([]);
      } else {
        cb(cart);
      }
    });
  }
};
