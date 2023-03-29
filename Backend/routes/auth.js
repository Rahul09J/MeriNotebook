const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Rahulisagoodboy';


// ROUTE - 1 {Create a user using : Post "/api/auth/createuser"}
router.post('/createuser',[
    body('name',"Enter a valid Name").isLength({ min: 5 }),
    body('email').isEmail(),
    body('password',"Password must be atleast 5 Charaters long").isLength({ min: 5 })
],async (req,res)=>{
    // if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whether the user with this email exists already

    try{
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({ errors: "Sorry a user already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const secpassword = await bcrypt.hash(req.body.password,salt);
    
    user = await User.create({
        name: req.body.name,
        password: secpassword,
        email: req.body.email
      })
      
    //   .then(user => res.json(user))
    //   .catch(err => {console.log(err)
    //   res.json({error:"User is already registeres" , message:err.message})})

    const data = {
        user:{
            id:user.id
        }
    }
    const authdata = jwt.sign(data,JWT_SECRET);
    res.json({authdata});
    }
    catch(error){
        console.log(error.message);
        res.status(400).json("some error occured");
    }
})
                        


// ROUTE - 2  Authenticate a user using POST : '/api/auth/login' - NO login Required

router.post('/login',[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password cannot be blank").exists()
],async (req,res)=>{

    // if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;

    try {
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json("Please Try again with correct credentials");
        }

        const passwordcompare = await bcrypt.compare(password,user.password);
        if(!passwordcompare){
            res.status(400).json("Please Try again with correct credentials");
        }

        const data = {
            user:{
                id:user.id
            }
        }
        const authdata = jwt.sign(data,JWT_SECRET);
        res.json({authdata});

    } catch(error){
        console.log(error.message);
        res.status(400).json("Internel server error");
    }


})


// ROUTE - 2  Authenticate a user using POST : '/api/auth/getuser' - login Required

router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch(error){
        console.log(error.message);
        res.status(400).json("Internel server error");
    }
})
module.exports = router;