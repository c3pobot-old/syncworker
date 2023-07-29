'use strict'
const raidInfo = {
  aat: {
    name: 'Tank',
    currency: 21,
    open: 90000
  },
  rancor: {
    name: 'Rancor',
    currency: 20,
    open: 60000
  },
  sith_raid: {
    name: 'Sith',
    currency: 22,
    open: 110000
  },
  rancor_challenge: {
    name: 'Challenge Rancor',
    currency: 23,
    open: 180000
  }
}
module.exports = async()=>{
  try{
    const obj = await mongo.find('raidSchedule', {})
    for(let i in obj){
      const timeNow = +(new Date()).getTime()
      if((timeNow + 5000) > obj[i].time || timeNow > obj[i].time){
        if(raidInfo[obj[i].raidId]){
          const gObj = (await mongo.find('guilds', {_id: obj[i].guildId}, {raids: 1, sId: 1}))[0]
          if(gObj && gObj.sId && gObj.raids && gObj.raids.filter(x=>x.id == obj[i].raidId && x.chId > 0).length > 0){
            const raidConfig = gObj.raids.find(x=>x.id == obj[i].raidId && x.chId > 0)
            let msgToSend = ''
            let sendMsg = 0
            if(raidConfig.roleId){
              msgToSend = '<@&'+raidConfig.roleId+'> '
            }
            if(obj[i].state == 'join'){
              msgToSend += (raidInfo[obj[i].raidId] ? raidInfo[obj[i].raidId].name:obj[i].raidId)+' raid is open for joining'
              sendMsg++
              let startTime = obj[i].time + obj[i].joinPeriod
              if(obj[i].sim == true) startTime -= 1800000
              await mongo.set('raidSchedule', {_id: obj[i]._id}, {time: startTime, state: 'start'})
            }
            if(obj[i].state == 'start'){
              if(obj[i].sim == true){
                msgToSend += (raidInfo[obj[i].raidId] ? raidInfo[obj[i].raidId].name:obj[i].raidId)+' raid will sim in ~30 minutes. Make sure you have joined'
                sendMsg++
                await mongo.del('raidSchedule',{_id: obj[i]._id})
              }else{
                if(raidConfig.hold > 0){
                  msgToSend += (raidInfo[obj[i].raidId] ? raidInfo[obj[i].raidId].name:obj[i].raidId)+' raid is open for battle. Hold Damge for '+raidConfig.hold+' minutes'
                  sendMsg++
                  let holdtime = (raidConfig.hold * 60) * 1000
                  holdtime += obj[i].time
                  mongo.set('raidSchedule',{_id: obj[i]._id}, {time: holdtime, state: 'hold'})
                }else{
                  msgToSend += (raidInfo[obj[i].raidId] ? raidInfo[obj[i].raidId].name:obj[i].raidId)+' raid is open for battle.'
                  sendMsg++
                  mongo.del('raidSchedule',{_id: obj[i]._id})
                }
              }
            }
            if(obj[i].state == 'hold'){
              msgToSend += raidInfo[obj[i].raidId].name+' raid damage can be released'
              sendMsg++
              await mongo.del('raidSchedule',{_id: obj[i]._id})
            }
            if(sendMsg > 0){
              if(process.env.BOT_URL_PREFIX){
                HP.DiscordMsg({sId: gObj.sId}, {method: 'sendMsg', chId: raidConfig.chId, msg: {content: msgToSend}})
              }else{
                MSG.SendMsg({chId: raidConfig.chId}, {content: msgToSend})
              }

            }
          }
        }
      }
    }
  }catch(e){
    console.log(e)
  }
}
