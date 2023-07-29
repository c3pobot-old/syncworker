'use strict'
require('./globals')
require('./expressServer')
process.on('unhandledRejection', (error) => {
  console.error(error)
});
let Ques = require('./ques')
const InitRedis = async()=>{
  try{
    await redis.init()
    const redisStatus = await redis.ping()
    if(redisStatus == 'PONG'){
      console.log('redis connection successful...')
      CheckAPIReady()
    }else{
      console.log('redis connection error. Will try again in 5 seconds...')
      setTimeout(InitRedis, 5000)
    }
  }catch(e){
    console.error('redis connection error. Will try again in 5 seconds...')
    setTimeout(InitRedis, 5000)
  }
}
const CheckAPIReady = async()=>{
  const obj = await Client.post('metadata')
  if(obj?.latestGamedataVersion){
    console.log('API is ready sync '+process.env.SHARD_NUM)
    apiReady = 1
    StartServices()
  }else{
    console.log('API is not ready on syncworker '+process.env.SHARD_NUM+'. Will try again in 5 seconds')
    setTimeout(()=>CheckAPIReady(), 5000)
  }
}
const StartServices = async()=>{
  try{
    await UpdateBotSettings()
    await UpdateSyncGuilds()
    await UpdateGameData()
    //await UpdateUnits()
    //await CheckAPIReady()
    StartQue()
  }catch(e){
    console.error(e);
    setTimeout(StartServices, 5000)
  }
}

const UpdateBotSettings = async()=>{
  try{
    const obj = (await mongo.find('botSettings', {_id: "1"}))[0]
    if(obj) botSettings = obj
    setTimeout(UpdateBotSettings, 60000)
  }catch(e){
    setTimeout(UpdateBotSettings, 5000)
    console.error(e)
  }
}
const UpdateSyncGuilds = async()=>{
  try{
    let obj = await mongo.find('guilds', {sync: 1}, {_id: 1, sync: 1})
    if(obj){
       obj = obj.filter(x=>x.sync && x._id).map(x=>x._id)
       syncGuilds = obj
    }
    setTimeout(UpdateSyncGuilds, 30000)
  }catch(e){
    console.error(e);
    setTimeout(UpdateSyncGuilds, 30000)
  }
}
const UpdateGameData = async()=>{
  try{
    const obj = (await mongo.find('botSettings', {_id: 'gameData'}))[0]
    if(obj?.version !== gameVersion && obj?.data){
      console.log('Setting new gameData to '+obj.version)
      gameVersion = obj.version;
      gameData = obj.data
      HP.UpdateUnitsList()
      gameDataReady = 1
    }
    setTimeout(UpdateGameData, 5000)
  }catch(e){
    console.log(e)
    setTimeout(UpdateGameData, 5000)
  }
}
const StartQue = ()=>{
  try{
    Ques.start()
  }catch(e){
    console.error(e);
    setTimeout(StartQue, 5000)
  }
}
InitRedis()
