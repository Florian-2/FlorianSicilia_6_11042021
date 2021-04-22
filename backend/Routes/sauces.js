const express = require('express');
const router = express.Router();

const saucesController = require('../Controllers/controller_sauce');
const auth = require('../AuthToken/auth_Token');
const multer = require('../multer/multer'); 

router.post('/', auth, multer, saucesController.createProducts);
router.get('/', auth, saucesController.getAllProducts);
router.get('/:id', auth, saucesController.getOneProducts);
router.delete('/:id', auth, saucesController.deleteOneSauce);

module.exports = router;