const express = require('express')

const { renderHome } =  require('../routes/home')
const { renderOverview } = require('../routes/overview')
const { renderDetail } = require('../routes/detail')
const { renderOffline } = require('../routes/offline')

function routeHandler() {
    const router = express.Router()
    router
        .get('/', renderHome)
        .get('/m/:category', renderOverview)
        .get('/m/:category/:id', renderDetail)
        .get('/offline', renderOffline)
    return router
}

module.exports = {
    routeHandler
}