'use strict'
const botRequest = require('botrequest')
module.exports = async(opts = {}, data = {})=>{
  try{
    let payload = {...opts, ...data}
    if(opts.shardId) payload.podName = 'bot-'+opts.shardId
    delete payload.shardId
    return await botRequest(payload.method, payload)
  }catch(e){
    throw(e)
  }
}
