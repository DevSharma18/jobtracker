const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const db = require('../db');
const { access } = require('fs');

function configurePassport(){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done)=>{
        try {
            const email = profile.emails[0].value;

            // check if user exists
            let result = await db.query('select * from users where email = $1', [email])

            if(result.rows.length===0){
                const randomPw = await bcrypt.hash(
                    crypto.randomBytes(32).toString('hex'), 10
                )
                result = await db.query(
                    'insert into users (email, password) values ($1, $2) returning *', [email, randomPw]
                )
            }
            done(null, result.rows[0])
        }catch(err){
            console.log(err)
        }
    }))
}

module.exports={ configurePassport }
