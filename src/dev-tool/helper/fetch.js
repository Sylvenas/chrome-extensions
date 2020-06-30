import Task from 'data.task'
import { URL_BASE, ERROR_TYPES } from './const'
import { promiseToTask } from './utils'



export const httpGet = url =>
    new Task((reject, resolve) =>
        fetch(url).then(res =>
            res.ok
                ? resolve(res)
                : reject({ type: ERROR_TYPES.httpFailed, msg: `http request '${url}' failed` })))
        .map(res => res.json())
        .chain(promiseToTask)
        .chain(res => res.code === 200 ? Task.of(res.result) : Task.rejected({ type: ERROR_TYPES.httpFailed, msg: res.message }))

export const getInterfaceDetial = id => httpGet(`${URL_BASE}/api/interfaces/${id}`)
export const getProjectDataTypes = pid => httpGet(`${URL_BASE}/api/datatypes/?pid=${pid}`)