const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login')
  }
  res.render('admin/post-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isEdit: req.query.edit,
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const userId = req.session.user._id
  const product = new Product({ title, price, description, imageUrl, userId })
  product
    .save()
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('includes/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        user: 'admin',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const isEdit = req.query.edit
  const id = req.params.productId
  if (!isEdit) {
    return res.redirect('/')
  }
  Product.findById(id)
    .then(product => {
      res.render('admin/post-product', {
        pageTitle: 'Edit Product',
        path: '/edit-product',
        product: product,
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        isEdit: isEdit,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title
  const imageUrl = req.body.imageUrl
  const price = req.body.price
  const description = req.body.description
  const id = req.body.id

  Product.findByIdAndUpdate(id, { title, price, description, imageUrl })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findByIdAndRemove(prodId)
    .then(() => {
      return req.user.deleteCartItem(prodId)
    })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
