const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/', shopController.getShop);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct)
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart)
router.post('/delete-product-cart', isAuth, shopController.deleteProductCart)
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder)

module.exports = router;
