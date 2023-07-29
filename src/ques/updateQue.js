'use strict'
const GuildQue = require('./que')
const syncGuilds = async()=>{
  try{
    let obj = await mongo.find('guilds', {'auto.guildId':{$exists: true}}, {auto: 1, sync: 1})
    for(let i in obj){
      if(obj[i]?.auto?.guildId){
        obj[i].auto.sync = obj[i].sync
        await GuildQue.newJob({jobType: 'message', data: obj[i].auto}, {jobId: 'msg-'+obj[i]._id})
      }
    }
  }catch(e){
    console.error(e)
  }
}
const Sync = async()=>{
  try{
    await syncGuilds()
    setTimeout(Sync, 5000)
  }catch(e){
    console.error(e);
    setTimeout(Sync, 5000)
  }
}
module.exports = Sync
