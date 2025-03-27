const express = require('express');
const router = express.Router();

const baseController = require('../controller/base.controller')

router.get('/',baseController.getLanding);


router.get('/401',function(req,res){
    res.status(401).render('includes/401');
})
router.get('/403',function(req,res){
    res.status(403).render('includes/403');
})





module.exports = router;