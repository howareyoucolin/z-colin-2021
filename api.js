require('dotenv').config()
const express = require('express')
const app = express()

//load routers
const blogApi = require('./api/blog')

app.use( '/blog', blogApi )

//satrt server and listen to requests
port = process.env.PORT || 3000
app.listen(port)
console.log('Zcolin RESTful API server started on: ' + port)
