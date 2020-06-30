const SPECIAL_STR_IN_TAB_TITLE = 'some_special_str_in_tab_title'
const SPECIAL_H1 = '#some_special_h1'

chrome.tabs.query({}, function (tabs) {
    tabs.forEach(tab => {
        if (tab.title.search(SPECIAL_STR_IN_TAB_TITLE) !== -1) {
            chrome.tabs.remove(tab.id)
        }
    })
});
