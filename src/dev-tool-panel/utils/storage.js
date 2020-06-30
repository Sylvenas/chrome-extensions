export const storage = {
    get(key) {
        const keys = Array.isArray(key) ? key : [key];
        return new Promise((resolve, _) => {
            chrome.storage.local.get(keys, function (result) { // eslint-disable-line
                if (result) { return resolve(!Array.isArray(key) ? result[key] : result) }
            });
        })
    },
    set(obj) {
        return new Promise((resolve, _) => {
            chrome.storage.local.set(obj, function () { // eslint-disable-line
                resolve(obj)
            });
        })
    },
    clear(keys) {
        return new Promise((resolve, _) => {
            chrome.storage.local.remove(keys, function () { // eslint-disable-line
                resolve(keys)
            });
        })
    }
}

export default storage