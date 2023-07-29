'use strict'
const express = require('express')
const app = express()
app.use(express.json({limit: '100MB'}))
app.use('/healthz', (req, res)=>{
  res.json({res: 'ok'}).status(200)
})
const server = app.listen(process.env.HEALTH_PORT || 3000, ()=>{
  console.log('player-syncworker server is listening on '+ server.address().port)
})
