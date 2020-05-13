/**
 * Check Tab
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {

    // Page URL: KEY
    var pageURLsKey = "objectVal__pageURLs";

    /**
     * Get Chrome Data
     */
    chrome.storage.local.get([pageURLsKey], function (k) {
      if (k[pageURLsKey] !== undefined && k[pageURLsKey] !== null && typeof (k[pageURLsKey]) === "object" && k[pageURLsKey].length > 0) {
        // URLs Data
        var urls = k[pageURLsKey];
        // For Loop
        for (let i = 0; i < urls.length; i++) {
          const item = urls[i];
          // Check URL isActive
          if (item.isActive) {

            // Match URL
            var matchURL = false;
            if (item.pageMatchType === "full") {
              matchURL = (tab.url === item.url); // Full Path
            } else if (item.pageMatchType === "pathname") {
              var checkURL = new URL(tab.url);
              matchURL = (checkURL.pathname === item.url); // pathname
            }

            if (matchURL === true) {
              // console.log("item", item)
              // console.log("tab", tab)

              /**
               * Execute Script and Set URL Index in the Chrome Variable
               */
              chrome.storage.local.set({
                "stringVal__activeURLIndex": i
              }, function () {
                chrome.tabs.executeScript(tabId, {
                  // TODO: Use Minify JS Script Path
                  file: '/script/run.js',
                }, function () {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                  }
                });
              });
            } else {
              console.error("URL Not Match.", item.url);
            }
          } else {
            // GO TO Next URL
            continue
          }
        }
      } else {
        console.error("Action URLs Data Not Found");
      }
    });
  }
});