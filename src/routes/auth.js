const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const passport = require('passport')
const {configurePassport} = require('../services/googleAuth')

configurePassport();

//enable session OAuth flow
router.use(require('express-session')({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}))

router.use(passport.initialize())


//POST /api/auth/signup
router.post('/signup', async (req, res)=>{
    const {email, password}= req.body
    if(!email || !password){
        return res.status(400).json({
            error: 'email and password are required'
        })
    }
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password.length < 8 || !passwordRegex.test(password)){
        return res.status(400).json({
            error: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character'
        })
    }
    try{
        const hashed = await bcrypt.hash(password, 10)

        //insert user
        const result = await db.query(
            'Insert into users (email, password) values ($1, $2) returning id', [email, hashed]
        )
        const userId = result.rows[0].id;

        //create JWT
        const token = jwt.sign(
            {userId},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        return res.status(201).json({ token })
    } catch(err){
        if(err.code === '23505'){
            return res.status(409).json({
                error: 'Email already exists'
            })
        }
        console.error(err)
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})

// POST /api/auth/login

router.post('/login', async (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            error: 'email and password are required'
        })
    }
    try{
        const result = await db.query(
            'Select * from users where email = $1', [email]
        )
        if(result.rows.length === 0){
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }
        const user = result.rows[0];

        //compare password
        const match = await bcrypt.compare(password, user.password)

        if(!match){
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }
        //create JWT
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        return res.json({token})
    } catch(err){
        console.error(err)
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})

// GET /api/auth/google - redirects user to Google's login page
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

// GET /api/auth/google/callback - Google redirects here after login

router.get('/google/callback', passport.authenticate('google', {session: false, failureRedirect: '/?error=auth_failed'}),
(req, res)=>{
    //create JWT for the user
    const token = jwt.sign(
        {userId:req.user.id},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )

    // redirect to frontend with token in url
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`)
})

module.exports = router;
