"use strict";
const discordhelper = require('discordhelper')
const swgohhelper = require('swgohhelper')
const Cmds = {...discordhelper,...swgohhelper}

Cmds.debugMsg = require('./debugMsg')
Cmds.ConfirmButton = ()=>{
  return
}
Cmds.DiscordMsg = require('./discordMsg')
module.exports = Cmds
