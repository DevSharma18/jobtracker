require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use(express.json())
app.use(express.static('public'));

// Auth and Jobs routes
const authRoutes = require('./src/routes/auth')
app.use('/api/auth', authRoutes)
const jobsRoutes = require('./src/routes/jobs')
app.use('/api/jobs', jobsRoutes)


app.set('io',io)  // make io accessible in routes

io.on('connection', (socket)=>{
    console.log('Browser connected via WebSocket', socket.id)
})

const PORT = process.env.PORT || 3000;

const { initDb } = require('./src/db');

initDb().then(()=>{
    httpServer.listen(PORT, ()=> {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch(err => {
    console.log('DB init failed', err)
    process.exit(1)
})