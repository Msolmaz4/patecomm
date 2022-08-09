const express = require('express')
const app = express()



//gonderdigim post req islem yapmak icin  urllencode izin vermem gerkiyor
app.use(express.urlencoded({extended :false}))
// body json formatinda gelenler icin 
app.use(express.json())


module.exports = app