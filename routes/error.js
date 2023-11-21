const express = require('express');

const errorCtrlers = require('../controllers/error')

const router = express.Router()

router.use(errorCtrlers.get404)

module.exports = router