const express = require('express')
const router = express.Router();
const multer = require('multer')
const fs = require('fs')
const db = require('../db')
const protect = require('../middleware/protect')
const {extractText} = require('../utils/pdf')
const {analyzeResume} = require('../services/gemini');
const { error } = require('console');

//configure multer - where to store files and what to accept

const upload = multer({
    dest: 'uploads/',
    limits: {fileSize: 5*1024*1024}, //5mb max
    fileFilter: (req,file, cb)=>{
        if(file.mimetype !== 'application/pdf'){
            return cb(new Error('Only PDF files allowed'))
        }
        cb(null,true)
    }
})

// POST /api/jobs/:id/analyze

router.post('/:id/analyze', protect, upload.single('resume'), async(req, res)=>{
    const io = req.app.get('io')
    const jobId =req.params.id;
    const userId = req.user.userId
    const filePath = req.file ? req.file.path : null

    if(!req.file){
        return res.status(400).json({error: 'Resume PDF required'})
    }
    try{
        //Check job exists and belongs to this user
        const jobResult = await db.query(
            'select * from jobs where id = $1 AND user_id = $2',
        [jobId, userId]
        )
        if(jobResult.rows.length ===0){
            fs.unlinkSync(filePath)
            return res.status(404).json({
                error : 'Not Found'
            })
        }
        const job = jobResult.rows[0]
        if(!job.description){
            fs.unlinkSync(filePath)
            return res.status(400).json({error:"Job has no description to compare against"})
        }
        // tell browser AI is working
        io.emit('ai:thinking', {message: 'AI is analyzing your resume...'})

        //Extract text form pdf
        const resumeText = await extractText(filePath)

        //call gemini

        const analysis =await analyzeResume(resumeText, job.description)

        //save to DB
        await db.query(
            'Insert into analyses (job_id, resume_text, match_score, missing_skills, action_plan) values ($1, $2, $3, $4, $5)',
            [jobId, resumeText, analysis.match_score, analysis.missing_skills, analysis.action_plan]
        )

        // tell browser AI is done
        io.emit('ai:done', analysis)

        //delete temp file
        fs.unlinkSync(filePath)

        return res.status(201).json(analysis)
    } catch(err){
        if(filePath && fs.existsSync(filePath))
            fs.unlinkSync(filePath)
        console.log(err)
        io.emit('ai:error', { error: 'Analysis Failed'})

        return res.status(500).json({error: 'Analysis failed'})
    }
})

// GET /api/jobs/:id/analysis

router.get('/:id/analysis', protect, async(req,res)=>{
    const jobId = req.params.id;
    const userId = req.user.userId;

    try{
        // verify job belongs to the user
        const jobResult = await db.query(
            'Select id from jobs where id = $1 AND user_id = $2', [jobId, userId]
        )

        if(jobResult.rows.length === 0){
            return res.status(404).json({error:'Not Found'})
        }

        const result = await db.query(
            'select match_score, missing_skills, action_plan, created_at from analyses where job_id = $1 order by created_by desc LIMIT 1', [jobId]
        )

        if(result.rows.length===0){
            return res.status(404).json({error:'No analysis found for this job'})
        }

        return res.json(result.rows[0])
    }catch(err){
        console.log(err)
        return res.status(500).json({error : 'Internal Server error'})
    }
})

module.exports = router
