'use strict'
const ProcessLocalQue = require('./processLocalQue')
const updateQue = require('./updateQue')
const monitorQue = require('./monitorQue')
const GuildQue = require('./que')
const POD_NAME = process.env.POD_NAME || 'syncworker-0'
const isOdd = (num)=>{
  return num % 2
}
const StartQues = async()=>{
  try{
    if(apiReady && gameDataReady){
      //await ProcessLocalQue(GuildQue)
      GuildQue.start();
      MonitorQue()
    }else{
      setTimeout(StartQues, 5000)
    }
  }catch(e){
    console.error(e);
    setTimeout(StartQues, 5000)
  }
}
const MonitorQue = async()=>{
  try{
    let num = POD_NAME.slice(-1)
    if(!isOdd(num)){
      console.log('Starting que update...')
      updateQue()
    }
    if(isOdd(num)){
      console.log('Starting que monitor..')
      monitorQue()
    }
  }catch(e){
    console.error(e);
  }
}
module.exports.start = StartQues
