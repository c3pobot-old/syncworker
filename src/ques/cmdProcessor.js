'use strict'
const Cmds = require('src/cmds')
const delay = (ms)=>{
  return new Promise(resolve=>{
    setTimeout(resolve, ms)
  })
}
module.exports = async(job)=>{
  try{
    let res
    //await HP.AddJob(job)
    if(redis && process.env.LOCAL_QUE_KEY && job?.jobId && job.data) await redis.setTTL(process.env.LOCAL_QUE_KEY+'-'+job.jobId, job)
    if(Cmds[job?.jobType]) res = await Cmds[job.jobType](job.data);
    //if(job?.jobType === 'syncGuild') console.log('Completed guild sync for '+job?.data?.guildId)
    //await HP.RemoveJob(job.jobId)
    if(redis && process.env.LOCAL_QUE_KEY && job?.jobId) await redis.del(process.env.LOCAL_QUE_KEY+'-'+job.jobId)
    return res;
  }catch(e){
    console.error(e);
  }
}
