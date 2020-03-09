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

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', function(req, res) {
    res.render('home', {
        title: 'Marvel',
        comics: 'Comics'
    })
})

app.get('/comics', function(req, res) {
    const url = `http://gateway.marvel.com/v1/public/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`

    fetch(url)
        .then(async response => {
            const comicData = await response.json()
            res.render('comic_overview', {
                title: 'Comics',
                comicData
            })
        })
});

app.get('/comics/:id', function(req, res) {
    const url = `http://gateway.marvel.com/v1/public/comics/${req.params.id}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`

    fetch(url)
        .then(async response => {
            const comicData = await response.json()
            const comic = comicData.data.results[0]
            res.render('comic_detail', {
                title: comic.title,
                description: comic.description
            })
        })
});

app.listen(config.port, function() {
    console.log(`Application started on port: ${config.port}`);
});