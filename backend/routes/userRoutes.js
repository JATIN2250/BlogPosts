const express = require("express");
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// FIXED: Changed route from '/' to '/register'
router.post('/', async (req, res) => {
    // FIXED: Changed 'userpass' to 'password' to match the frontend
    const { username, email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM userInfo WHERE email = $1', [email]);

        if (user.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        // Use the correct 'password' variable for hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO userInfo (username, email, userpass) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            msg: 'User registration successful!',
            user: newUser.rows[0],
        });
        
    } catch (err) {
        console.error(err.message);
        // Best Practice: Send errors in JSON format
        res.status(500).json({ msg: 'Server Error' });
    }
});


// For creating token when user logged in

router.post('/login', async(req,res)=>{
    const{email,password} = req.body;
    try{
        const user = await pool.query('SELECT * FROM userInfo WHERE email=$1',[email]);
        if(user.rows.length===0){
            return res.status(400).json({msg:"Invalid credentials"});
        }


        const isValidPassword = await bcrypt.compare(password,user.rows[0].userpass);
        if(!isValidPassword){
            return res.status(400).json({msg: "Invalid credentials."});
        }

        const payload = {
            user:{
                id:user.rows[0].user_id,
            },
        };

        jwt.sign(
            payload,
            process.env.JW_SECRET,
            {expiresIn : '1h'}, 
            (err,token) =>{
                if(err) throw err; 
                res.json({token});
            }
        );


    }

    catch(err){
        console.error(err.message);
        res.status(500).json({msg:'Server Error'});
    }
});

module.exports = router;