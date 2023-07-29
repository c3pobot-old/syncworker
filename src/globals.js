'use strict'
const RedisWrapper = require('rediswrapper')
global.numeral = require('numeral')
global.apiReady = 0
global.gameDataReady = 0
global.debugMsg = +process.env.DEBUG || 0
global.botSettings = {}
global.syncGuilds = []
global.gameData = {}
global.gameVersion = ''
//global.CmdMap = require('./cmdMap')

global.mongo = require('mongoapiclient')

global.redis = new RedisWrapper({
  host: process.env.REDIS_SERVER,
  port: process.env.REDIS_PORT,
  passwd: process.env.REDIS_PASS
})
global.Client = require('./client')
global.HP = require('./helpers')
global.MSG = require('discordmsg')
