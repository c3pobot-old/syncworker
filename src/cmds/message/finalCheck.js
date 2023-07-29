'use strict'
module.exports = async(obj = {})=>{
  try{
    let gObj = await Client.post('guild', {guildId: obj.guildId, includeRecentGuildActivityInfo: true}, null)
    if(gObj?.guild) gObj = gObj.guild
    if(gObj?.member){
      if(gObj.profile?.id) mongo.set('ticketCache', {_id: gObj.profile.id}, {member: gObj.member, updated: Date.now(), TTL: new Date(gObj.nextChallengesRefresh * 1000)})
      const embedMsg = await HP.GetLowTickets(gObj)
      if (embedMsg){
        if(process.env.BOT_URL_PREFIX){
          HP.DiscordMsg({sId: obj.sId}, {method: 'sendMsg', chId: obj.chId, msg: {embeds: [embedMsg]}})
        }else{
          MSG.SendMsg(obj, { embeds: [embedMsg] });
        }
      }
    }
    await mongo.set('guilds', { _id: obj.guildId }, { 'auto.final': Date.now() })
  }catch(e){
    console.log(e)
  }
}
