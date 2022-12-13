chrome.tabs.onUpdate.addListener((tabId,tab)=>{
    if (tab.url && tab.url.includes("youtube.com/watch")){
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters)
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoID: urlParameters.get("v"),

        })
    }
})