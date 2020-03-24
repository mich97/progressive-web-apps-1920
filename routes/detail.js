const fetch = require('node-fetch')
const md5 = require('md5')
const timestamp = Date.now()
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY
const hash = md5(timestamp + privateKey + publicKey)

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

module.exports = {
    renderDetail
}