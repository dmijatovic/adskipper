
let currentTab,
  time = document.getElementById("time"),
  skip = document.getElementById("skip"),
  overlay = document.getElementById("overlay"),
  errors = document.getElementById("errorCnt")
  status = "OFF"

function logger(msg){
  console.log(`[Auto Skip Ad popup]...${msg}`)
}

function showStats(payload){
  const {skipAdCnt, overlayAdCnt, runningTimeMs, errorCnt} = payload
  // if (stats) stats.innerHTML=`${skipAdCnt||0}.${overlayAdCnt||0}`
  if (time) {
    let minutes=0
    if (runningTimeMs){
      const min1dec = Math.round((runningTimeMs / (1000 * 60)) * 10)
      minutes = min1dec / 10
    }
    time.innerHTML= `${minutes} min.`
  }
  if (skip){
    skip.innerHTML = skipAdCnt
  }
  if (overlay){
    overlay.innerHTML = overlayAdCnt
  }
  if (errors){
    errors.innerHTML = errorCnt
  }
}

function setONStatus(){
  chrome.action.setBadgeText({
    // tabid
    text:"ON"
  })
  chrome.action.enable()
}

function setOFFStatus(){
  chrome.action.setBadgeText({
    // tabid
    text:"OFF"
  })
  chrome.action.disable()
}

function askForStats(){
  try{
    if (currentTab){
      chrome.tabs.sendMessage(
        currentTab.id,{
          type:"GET_STATS"
        },
        undefined,
        function(response){
          // logger(`RESPONSE: ${JSON.stringify(response)} `)
          if (response){
            switch (response.type){
              case "AD_SKIPPER":
                showStats(response.payload)
                setONStatus()
                break;
              default:
                logger(`Response type ${response.type} NOT SUPPORTED!`)
            }
          } else if (chrome.runtime.lastError){
            setOFFStatus()
          }
        }
      )
    }else{
      logger("ERROR [askForStats]: currentTab is UNDEFINED")
    }
  }catch(e){
    logger(`ERROR [askForStats]: ${e.message}`)
  }
}

function getCurrentTab(){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  },function(tabs){
    currentTab = tabs[0]
    // logger(`tabs ${JSON.stringify(tabs)}`)
    // logger(`currentTab ${JSON.stringify(currentTab)}`)
    if (currentTab) askForStats()
  })
}

getCurrentTab()

logger("Started")
