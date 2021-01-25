
let cnt = 0,
  skipAdCnt=0,
  overlayAdCnt=0,
  checkInterval=2000,
  reportCycle=30,
  errorCnt=0,
  startDateTime

function logger(msg){
  console.log(`[Auto Skip Ad]...${msg}`)
}

function report(){
  console.group(`[Auto Skip Ad] ${skipAdCnt} ${overlayAdCnt}`)
  console.log(`Skip add btn clicked: ${skipAdCnt}`)
  console.log(`Add overlay close btn clicked: ${overlayAdCnt}`)
  console.groupEnd()
}

function checkForSkipAdd(){
  const skipBtn = document.querySelector(".ytp-ad-skip-button")
  if (skipBtn) return skipBtn
  return undefined
}

function checkForOverlayAdCloseBtn(){
  const closeBtn = document.querySelector(".ytp-ad-overlay-close-button")
  if (closeBtn) return closeBtn
  return undefined
}

function startMonitoring(){
  const loper = setInterval(()=>{
    cnt+=1
    const skipBtn = checkForSkipAdd()
    if (skipBtn){
      logger("Skip Ad button found")
      try{
        skipBtn.click()
        logger("Skip Ad button CLICKED")
        skipAdCnt+=1
      }catch(e){
        logger(`FAILED to click on skipBtn. Error: ${e.message}`)
        errorCnt+=1
      }
    }
    const closeAdBtn = checkForOverlayAdCloseBtn()
    if (closeAdBtn){
      logger("Overlay Ad button found")
      try{
        closeAdBtn.click()
        logger("Overlay Ad close button CLICKED")
        overlayAdCnt+=1
      }catch(e){
        logger(`FAILED to click on closeAdBtn. Error: ${e.message}`)
        errorCnt+=1
      }
    }
    // if (cnt>=reportCycle){
    //   //message every x times
    //   report()
    //   //reset counter
    //   cnt=0
    // }
  },checkInterval)

  startDateTime = new Date()
  logger("Started monitoring")
}

function getTimeDiffFromNow(start){
  const end = new Date()
  const diff = end - start
  return diff
}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  logger(`Message received: ${JSON.stringify(message)}`)
  // logger(`Message sender: ${JSON.stringify(sender)}`)
  // console.log("sendResponse: ", sendResponse)
  switch(message.type){
    case "GET_STATS":
      sendResponse({
        type:"AD_SKIPPER",
        payload:{
          skipAdCnt,
          overlayAdCnt,
          errorCnt,
          runningTimeMs: getTimeDiffFromNow(startDateTime),
        }
      })
      break;
    default:
      sendResponse({
        type:"AD_SKIPPER",
        payload:`Message type ${message.type} UNKNOWN!`
      })
  }
})

startMonitoring()