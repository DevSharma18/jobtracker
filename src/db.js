const {Pool} = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})
async function query(text, params) {
    const result = await pool.query(text,params)
    return result;
}

async function initDb(){
    const schema = fs.readFileSync(path.join(__dirname,'schema.sql'), 'utf-8')
    await pool.query(schema)
    console.log('DB schema ready')
}

module.exports = {query, initDb}