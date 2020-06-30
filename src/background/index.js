const SPECIAL_STR_IN_TAB_TITLE = 'onUpdated'
const SPECIAL_H1 = '#bass-container'

chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => {
        if (tab.title.search(SPECIAL_STR_IN_TAB_TITLE) !== -1) {
            chrome.tabs.remove(tab.id)
        }
    })
});