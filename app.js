require('dotenv').config()
const port = process.env.PORT || 3000
const express = require('express')

const app = express()
const compression = require('compression')

const { routeHandler } = require('./modules/router')

app
    .set('view engine', 'ejs')
    .set('views', 'views')
    .use(compression())
    .use(express.static('static'))
    .use('/', routeHandler())


app.listen(port, function () {
    console.log(`Application started on port: ${port}`)
})