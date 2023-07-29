'use strict'
module.exports = async(obj = {})=>{
  try{
    let gObj = await Client.post('guild', {guildId: obj.guildId, includeRecentGuildActivityInfo: true}, null)
    if(gObj?.guild) gObj = gObj.guild
    if(gObj?.member){
      if(gObj.profile?.id) mongo.set('ticketCache', {_id: gObj.profile.id}, {member: gObj.member, updated: Date.now(), TTL: new Date(gObj.nextChallengesRefresh * 1000)})
      await HP.SendMessages(obj, gObj)
    }else{
      await mongo.set('guilds', { _id: obj.guildId }, { 'auto.sent': Date.now() })
      if(process.env.BOT_URL_PREFIX){
        await HP.DiscordMsg({sId: obj.sId}, {method: 'sendMsg', chId: obj.chId, msg: {content: 'Error getting guild data to auto send messages'}})
      }else{
        await MSG.SendMsg(obj, 'Error getting guild data to auto send messages')
      }
    }
  }catch(e){
    console.log(e)
  }
}
