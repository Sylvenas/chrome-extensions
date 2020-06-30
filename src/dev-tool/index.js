import Task from 'data.task'
import Either from 'data.either'
import { pathToRegexp } from "path-to-regexp";

import makeScheme from './lib/makeScheme'
import responseValitaion from './lib/responseValitaion'

import { STORAGE_INTERFACE_LIST, ERROR_TYPES, RESULT_ERROR_LIST, RESULT_SUCCESS_LIST } from './helper/const'
import { getInterfaceDetial, getProjectDataTypes } from './helper/fetch'
import { shouldValidation, eitherToTask, getItem, setItem, unique, saveValicationResult } from './helper/utils'

if ("panels" in chrome.devtools) {
    window.chrome.devtools.panels.create(
        "Insight Targets",
        "icons/.png",
        "panel.html",
    );
}

window.chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (!shouldValidation(request)) return
    const path = new URL(request.request.url).pathname.replace('weapi', 'api');

    request.getContent(body => {
        app({ path, body }).fork(
            e => console.error('err', e),
            res => res.fold(
                saveValicationResult(RESULT_ERROR_LIST),
                saveValicationResult(RESULT_SUCCESS_LIST),
            ))
    }
    );
});

const findInterface = path => interfacelist => {
    const result = interfacelist
        .filter(x => !x.disabled)
        .map(item => ({ regexp: pathToRegexp(item.path), ...item }))
        .find(({ regexp }) => regexp.exec(path))
    return result
        ? Either.Right(result)
        : Either.Left({ type: ERROR_TYPES.notConfigured, msg: `Interface path: "${path}" is not configured in the Insight targets list ` })
}

const getDataTypes = ({ iid, pid }) =>
    Task.of(interfaceDetail => projectDataTypes => ({ interfaceDetail, projectDataTypes }))
        .ap(getInterfaceDetial(iid))
        .ap(getProjectDataTypes(pid))


const app = ({ path, body }) =>
    getItem(STORAGE_INTERFACE_LIST)
        .map(findInterface(path))
        .chain(eitherToTask)
        .chain(getDataTypes)
        .map(makeScheme)
        .chain(responseValitaion(body))





