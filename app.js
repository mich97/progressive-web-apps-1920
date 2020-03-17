require('dotenv').config()

const express = require('express')
const fetch = require('node-fetch')
const md5 = require('md5')

const timestamp = Date.now()
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY
const hash = md5(timestamp + privateKey + publicKey)

const config = {
    port: 3000
}

const app = express()
app
    .set('view engine', 'ejs')
    .set('views', 'views')
    .use(express.static('static'))
    .use('/', routes())


function routes() {
    const router = express.Router()
    router
        .get('/', renderHome)
        .get('/m/:category', renderOverview)
        .get('/m/:category/:id', renderDetail)
    return router
}

function renderHome(req, res) {
    res.render('home')
}

function renderOverview(req, res) {
    const category = req.params.category
    const url = `http://gateway.marvel.com/v1/public/${category}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`

    fetch(url)
        .then(async response => {
            const data = await response.json()
            res.render(`${category}_overview`, {
                data
            })
        })
}

function renderDetail(req, res) {
    const category = req.params.category
    const id = req.params.id
    const url = `http://gateway.marvel.com/v1/public/${category}/${id}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`

    fetch(url)
        .then(async response => {
            const data = await response.json()
            const detail = data.data.results[0]
            res.render(`${category}_detail`, {
                detail
            })
        })
}

app.listen(config.port, function () {
    console.log(`Application started on port: ${config.port}`)
})