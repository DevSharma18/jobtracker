const express = require('express')
const router = express.Router()
const db = require('../db')
const protect = require('../middleware/protect')


//GET /api/jobs - list all jobs for logged-in user
router.get('/',protect, async (req,res)=>{
    try{
        const result = await db.query(
            'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]
        )
        return res.json(result.rows)
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error'})
    }
})

//POST /api/jobs - add new job application

router.post('/',protect, async (req,res)=>{
    const { company, role, status, description} = req.body
    if(!company || !role){
        return res.status(400).json({
            error: 'company and role are required'
        })
    }
    try {
        const result = await db.query(
            'insert into jobs (user_id, company, role, status, description) values ($1, $2, $3, $4, $5) returning *',
            [req.user.userId, company, role, status || 'applied', description || null]
        )
        return res.status(201).json(result.rows[0])
    }catch(err){
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error'})
    }
})
module.exports = router