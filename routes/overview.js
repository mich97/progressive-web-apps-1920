const fetch = require('node-fetch')
const md5 = require('md5')
const timestamp = Date.now()
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY
const hash = md5(timestamp + privateKey + publicKey)

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

module.exports = {
    renderOverview
}