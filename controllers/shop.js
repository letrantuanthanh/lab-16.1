const Product = require('../models/product')

exports.getShop = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // get full information of user by userId and merge it in product
    // .populate('userId', 'username')
    .then(products => {
      res.render('includes/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        user: 'client',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('includes/products', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        user: 'client',
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .then(product => {
      res.render('shop/product-detail', {
        path: '/product',
        pageTitle: product.title,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const id = req.body.productId
  Product.findById(id)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.deleteProductCart = (req, res, next) => {
  const prodId = req.body.id
  req.user
    .deleteCartItem(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      })
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}
