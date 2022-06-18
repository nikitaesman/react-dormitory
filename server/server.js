const express = require('express')
const config = require('config')
const colors = require('colors')
const path = require('path')
const sequelize = require('./src/connection')

const app = express()

const PORT = config.get("PORT") || 5000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api', require('./src/routes/index.route'))

if (process.env.NODE_ENV === "production") {
    app.use('/', express.static(path.resolve(__dirname, '../client', 'build')))

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
    })
}

async function start() {
    try {
        await sequelize.authenticate()
        app.listen(PORT, ()=> console.log(`Server has been started on port ${PORT}...`.bgGreen))
    } catch (e) {
        console.log("Server error:".bgRed, e.message)
        process.exit(1)
    }
}

start()