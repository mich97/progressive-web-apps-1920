require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const md5 = require('md5')

const config = {
    port: 3000
}

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.send('Helloooooo wooooooorld');
    console.log('hoi')

    const timestamp = Date.now()
    const publicKey = process.env.PUBLIC_KEY
    const privateKey = process.env.PRIVATE_KEY
    const hash = md5(timestamp + privateKey + publicKey)
    const url = `http://gateway.marvel.com/v1/public/comics?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`

    fetch(url)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err))
});

app.listen(config.port, function() {
    console.log(`Application started on port: ${config.port}`);
});