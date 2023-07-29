'use strict'
module.exports = (obj)=>{
  try{
    const tempObj = {status: 'failed'}
    if(obj && obj.debugMsg >= 0){
      debugMsg = +obj.debugMsg
      console.log('debug has been turned '+(debugMsg == 1 ? 'on':'off'))
      tempObj.status = 'ok'
    }
    return tempObj
  }catch(e){
    console.log(e)
    return({status: 'error'})
  }
}
