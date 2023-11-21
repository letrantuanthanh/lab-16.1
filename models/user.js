const mongoose = require('mongoose')

const Order = require('./order')
const Product = require('./product')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
})

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString()
  })
  if (cartProductIndex >= 0) {
    this.cart.items[cartProductIndex].quantity++
  } else {
    this.cart.items.push({ productId: product._id, quantity: 1 })
  }
  return this.save()
}

userSchema.methods.deleteCartItem = function (prodId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== prodId.toString()
  })
  this.cart.items = updatedCartItems
  return this.save()
}

userSchema.methods.addOrder = function () {
  return Product.find().then(products => {
    const fullInfoCartItems = this.cart.items.map(item => {
      return {
        quantity: item.quantity,
        product: {
          ...products.find(prod => {
            return prod._id.toString() === item.productId.toString()
          }),
        },
      }
    })
    const order = new Order({
      products: fullInfoCartItems,
      userId: this._id
    })
    return order.save()
  })
  .then(() => {
    this.cart = {items: []}
    return this.save()
  })
}

userSchema.methods.getOrders = function () {
  return Order.find()
    .then(orders => {
      const pointOrders = orders.filter(ord => {
        return ord.userId.toString() === this._id.toString()
      })
      return pointOrders
    })
}

module.exports = mongoose.model('User', userSchema)
