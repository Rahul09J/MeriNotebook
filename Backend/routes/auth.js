const express = require('express');
const router = express.Router();
const user = require('../models/User');


router.get('/',(req,res)=>{
    res.send("hello from auth")
})

module.exports = router;