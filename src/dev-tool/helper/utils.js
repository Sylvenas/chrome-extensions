import Task from 'data.task'
import Either from 'data.either'
import { ERROR_TYPES } from './const'

export const shouldValidation = request => {
    if (request.request.url &&
        request.response.content &&
        request.response.content.mimeType === 'application/json') {
        return true
    }
    return false
}

export const fist = xs =>
    Either.fromNullable(xs[0])

export const eitherToTask = e =>
    e.fold(Task.rejected, Task.of)

export const promiseToTask = promise =>
    new Task((reject, resolve) =>
        promise.then(resolve).catch(reject)
    )

export const parse = Either.try(JSON.parse)

export const getItem = key =>
    new Task((reject, resolve) =>
        chrome.storage.local.get(key, result => {
            result[key]
                ? resolve(result[key])
                : reject({
                    type: ERROR_TYPES.canNotFound,
                    msg: `Can'd found key: "${key}" in chrome.storage.local. `
                })
        })
    )

export const setItem = obj =>
    chrome.storage.local.set(obj, () => {
        console.log(obj, '存储成功')
    })


export const unique = (list = [], content) =>
    [...list.filter(x => x.interfaceInfo.path !== content.interfaceInfo.path), content]

export const saveValicationResult = type => content => {
    getItem(type)
        .fork(() => setItem({ [type]: [content] }),
            (list) => setItem({ [type]: unique(list, content) }))
}
