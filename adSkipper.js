
let cnt = 0,
  skipAdCnt=0,
  overlayAdCnt=0,
  checkInterval=5000,
  reportCycle=30,
  errorCnt=0,
  startDateTime

function logger(msg,el){
  if (el){
    console.log(`[adSkipper]...${msg}`,el)
  }else{
    console.log(`[adSkipper]...${msg}`)
  }
}

function report(){
  console.group(`[adSkipper] ${skipAdCnt} ${overlayAdCnt}`)
  console.log(`Skip add btn clicked: ${skipAdCnt}`)
  console.log(`Add overlay close btn clicked: ${overlayAdCnt}`)
  console.groupEnd()
}

/**
 * Not used just a reference to movie_player id
 */
function getMoviePlayer(){
  const mp = document.getElementById("movie_player")
  if (mp){
    logger("movie_player", mp)
  }
}

/**
 * Using two classes to determine if add is created and playing.
 * If ad is created but not playing we remove ad-created class in attempt to block ads?!?
 * 2024-05-02 back to using only .ad-showing class
 * @returns
 */
function isAdPlaying(){
  const mp = document.querySelector(".ad-showing")
  if (mp){
    logger("ad playing")
    return true
  }
  // const ad = document.querySelector(".ad-created")
  // if (ad){
  //   logger("Ad created")
  // }
  // if (ad){
  //   // remove class
  //   ad.classList.toggle("ad-created")
  //   logger("Ad created class removed")
  // }
  return false
}

function isActionable(el) {
  // disabled element
  if (el.disabled === true){
    logger("isActionable...disabled")
    return false
  }
  // hidden element
  if (el.hidden === true){
    logger("isActionable...hidden")
    return false
  }
  // client size ~ visible
  if (el.clientHeight > 0 && el.clientWidth >0 ) {
    logger("isActionable...TRUE")
    return true
  }
  // ELSE
  logger("isActionable...FALSE")
  return false
}

function checkForSkipAdd(){
  const skipBtn = document.querySelector("button.ytp-skip-ad-button")
  if (skipBtn && isActionable(skipBtn)===true) return skipBtn
  const skipBtnModern = document.querySelector("button.ytp-ad-skip-button-modern")
  if (skipBtnModern && isActionable(skipBtnModern)===true) return skipBtnModern
  return undefined
}

function useSkipButton(btn){
  try{
    btn.onclick = (e) =>{
      // THESE ARE UNMUTABLE
      // e.isTrusted=true
      // e.detail=1
      // e.pointerId=1
      // e.pointerType="mouse"
      logger("SkipAdd...clicked", e)
      // debugger
      skipAdCnt+=1
    }
    btn.click()
  }catch(e){
    logger(`useSkipButton...ERROR: ${e.message}`)
    errorCnt+=1
  }
}

function checkForOverlayAdCloseBtn(){
  const closeBtn = document.querySelector(".ytp-ad-overlay-close-button")
  if (closeBtn && isActionable(closeBtn)) return closeBtn
  return undefined
}

function closeOverlayAdd(btn){
  try{
    btn.onclick = (e) =>{
      // THESE ARE UNMUTABLE
      // e.isTrusted=true
      // e.detail=1
      // e.pointerId=1
      // e.pointerType="mouse"
      logger("closeOverlayAdd clicked", e)
      // debugger
      overlayAdCnt+=1
    }
    btn.click()
  }catch(e){
    logger(`closeOverlayAdd...ERROR: ${e.message}`)
    errorCnt+=1
  }
}

function startMonitoring(){
  const loper = setInterval(()=>{
    cnt+=1

    // window.google_ad_status=null
    // logger(`window.google_ad_status=${window.google_ad_status}`)

    if (isAdPlaying()===true){
      const skipBtn = checkForSkipAdd()
      if (skipBtn){
        useSkipButton(skipBtn)
      }
    }

    const closeAdBtn = checkForOverlayAdCloseBtn()
    if (closeAdBtn){
      closeOverlayAdd()
    }

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