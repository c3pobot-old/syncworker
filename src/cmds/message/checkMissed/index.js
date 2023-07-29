'use strict'
const CreateMissedMsg = require('./createMissedMsg')
module.exports = async(obj = {})=>{
  try{
    let ticketCount = 600
    if(obj.ticketCount >= 0) ticketCount = obj.ticketCount
    const cache = (await mongo.find('ticketCache', {_id: obj.guildId}))[0]
    let gObj = await Client.post('guild', {guildId: obj.guildId, includeRecentGuildActivityInfo: true}, null)
    if(gObj?.guild) gObj = gObj.guild
    const timeDiff = Date.now() - cache.updated
    if(cache && gObj && gObj.guild){
      if(14400000 > timeDiff ){
        gObj.updated = Date.now()
        const embedMsg = await CreateMissedMsg(gObj, ticketCount, cache)
        if(embedMsg){
          MSG.SendMsg(obj, {embed: embedMsg})
          await mongo.set('guilds', { _id: obj.guildId }, { 'auto.missed': Date.now() })
        }
      }else{
        MSG.SendMsg(obj, {content: 'Sorry I could not check who missed becuase the cached data is too old'})
        await mongo.set('guilds', { _id: obj.guildId }, { 'auto.missed': Date.now() })
      }
    }
  }catch(e){
    console.log(e)
  }
}
