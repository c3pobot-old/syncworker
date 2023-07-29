'use strict'
module.exports = async(obj = {})=>{
  try{
    obj.force = true
    //console.log('Started guild sync for '+obj.guildId)
    if(obj.guildId) return await Client.post('updateGuild', obj, null)
  }catch(e){
    console.error(e)
  }
}
