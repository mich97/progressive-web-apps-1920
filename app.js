require('dotenv').config()

const port = process.env.PORT || 3000

const express = require('express')
const fetch = require('node-fetch')
const md5 = require('md5')

const cors = "https://cors-anywhere.herokuapp.com/"
const timestamp = Date.now()
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY
const hash = md5(timestamp + privateKey + publicKey)

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
        .get('/offline', renderOffline)
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
            const overview = data.data.results.filter(item =>
                item.thumbnail.path !== "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
                && item.description !== null)

            const modifiedOverview = overview.map(item => {
                let thumbnailPath = item.thumbnail.path
                thumbnailPath = thumbnailPath.replace(/^http:\/\//i, 'https://')

                return {
                    id: item.id,
                    name: item.title || item.name,
                    img: `${thumbnailPath}.${item.thumbnail.extension}`
                }
            })

            res.render(`${category}_overview`, {
                modifiedOverview
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
            let thumbnailPath = detail.thumbnail.path
            thumbnailPath = thumbnailPath.replace(/^http:\/\//i, 'https://')

            const modifiedDetail = {
                id: detail.id,
                img: `${thumbnailPath}.${detail.thumbnail.extension}`,
                name: detail.title || detail.name,
                description: detail.description
            }

            res.render(`${category}_detail`, {
                modifiedDetail
            })
        })
}

function renderOffline(req, res) {
    res.render('offline')
}

app.listen(port, function () {
    console.log(`Application started on port: ${port}`)
})