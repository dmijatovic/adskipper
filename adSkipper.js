
let cnt = 0,
  skipAdCnt=0,
  overlayAdCnt=0,
  checkInterval=2000,
  reportCycle=30

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
      }
    }
    if (cnt>=reportCycle){
      //message every x times
      report()
      //reset counter
      cnt=0
    }
  },checkInterval)

  logger("Started monitoring")
}

startMonitoring()