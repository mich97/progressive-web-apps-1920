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
    .use(express.static('public'))
    .use('/', routes())


function routes() {
    const router = express.Router()
    router
        .get('/', renderHome)
        .get('/comics', renderOverview)
        .get('/characters', renderOverview)
        .get('/series', renderOverview)
        .get('/comics/:id', renderDetail)
        .get('/characters/:id', renderDetail)
        .get('/series/:id', renderDetail)
    return router
}

function renderHome(req, res) {
    res.render('home', {
        title: 'Marvel',
        comics: 'Comics',
        characters: 'Characters',
        series: 'Series'
    })
}


function renderOverview(req, res) {
    const category = req.path.slice(1)
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
    const category = req.path.slice(1, 7) /* currently only slices for 'comics' */
    const id = req.path.slice(8)
    const url = `http://gateway.marvel.com/v1/public/${category}/${id}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`
    console.log(req)
    console.log(category, id)

/*    fetch(url)
        .then(async response => {
            const data = await response.json()
            const detail = data.data.results[0]
            res.render(`${category}_detail`, {
                detail
            })
        })*/
}

app.listen(config.port, function () {
    console.log(`Application started on port: ${config.port}`)
})