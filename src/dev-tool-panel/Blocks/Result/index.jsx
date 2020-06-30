import React, { useEffect, useState } from 'react'
import storage from '../../utils/storage'
import { getProjectInfo, getProjectInterfaces } from '../../utils/fetch'
import { jsonBeautify } from '../../utils/json'
import './index.less'

export default ({ }) => {
    const [interfaceList, setInterfaceList] = useState([])
    const [errorList, setErrorList] = useState([])
    const [successList, setSuccessList] = useState([])

    const [activeIid, setActiveIid] = useState(null)
    const [activeErrors, setActiveErrors] = useState([])

    useEffect(() => {
        chrome.storage.onChanged.addListener(function callback(changes, areaName) {    // eslint-disable-line
            if (changes.errorList) {
                setErrorList(changes.errorList.newValue)
            }
            if (changes.successList) {
                setSuccessList(changes.successList.newValue)
            }
        })
    }, [])

    useEffect(() => {
        storage.get('errorList').then((x = []) => { setErrorList(x) })
        storage.get('successList').then((x = []) => { setSuccessList(x) })
        storage.get('interfacelist').then((x = []) => setInterfaceList(x))
    }, [])

    const goToNEI = (pid, iid) => {
        window.open(`https://nei.hz.netease.com/interface/detail/?pid=${pid}&id=${iid}`)
    }

    const showAside = item => {
        setActiveErrors(item.errors)
        setActiveIid(item.interfaceInfo.id)
    }

    const interfaceListLen = interfaceList
        .filter(item => !item.disabled)
        .length

    return (
        <div className='block'>
            <div className='proportion'>
                <div className='error' style={{ width: (errorList.length / interfaceListLen) * 100 + '%' }}></div>
                <div className='succ' style={{ width: (successList.length / interfaceListLen) * 100 + '%' }}></div>
                <div className='unknow' style={{ width: ((interfaceListLen - errorList.length - successList.length) / interfaceListLen) * 100 + '%' }}></div>
            </div>
            <section className='interface-list table'>
                <div className="table-hd">
                    <div className="table-row-cell">Path</div>
                    <div className="table-row-cell">Desc</div>
                    <div className="table-row-cell">Creator</div>
                    <div className="table-row-cell">Status</div>
                </div>
                <div className="table-body">
                    {
                        errorList.map(item => (
                            <div className='table-row pointer' style={{
                                backgroundColor: activeIid === item.interfaceInfo.id ? '#F5F7FA' : ''
                            }} key={item.interfaceInfo.id} onClick={() => showAside(item)}>
                                <div className="table-row-cell">{item.interfaceInfo.path}</div>
                                <div className="table-row-cell">{item.interfaceInfo.name}</div>
                                <div className="table-row-cell">{item.interfaceInfo.realname}</div>
                                <div className="table-row-cell status-err"></div>
                            </div>
                        ))
                    }
                    {
                        successList.map(item => (
                            <div className='table-row pointer' key={item.interfaceInfo.id}>
                                <div className="table-row-cell">{item.interfaceInfo.path}</div>
                                <div className="table-row-cell">{item.interfaceInfo.name}</div>
                                <div className="table-row-cell">{item.interfaceInfo.realname}</div>
                                <div className="table-row-cell status-succ"></div>
                            </div>
                        ))
                    }
                    {
                        interfaceList
                            .filter(item =>
                                !item.disabled &&
                                successList.findIndex(x => x.interfaceInfo.id === item.iid) < 0 &&
                                errorList.findIndex(x => x.interfaceInfo.id === item.iid) < 0)
                            .map(item => (
                                <div className='table-row pointer' key={item.id}>
                                    <div className="table-row-cell">{item.path}</div>
                                    <div className="table-row-cell">{item.name}</div>
                                    <div className="table-row-cell">{item.realname}</div>
                                    <div className="table-row-cell status-unknow"></div>
                                </div>
                            ))
                    }
                </div>
            </section>
            {
                activeErrors.length ?
                    <section className='result-aside'>
                        <div className='btn-close' onClick={() => {
                            setActiveErrors([])
                            setActiveIid(null)
                        }}></div>
                        <div className='error-detial'>
                            {
                                activeErrors.map(err => (
                                    <div className='item'>
                                        <div className='line'>
                                            <p className='title'>Path: </p>
                                            <p>{err.dataPath}</p>
                                        </div>
                                        <div className='line'>
                                            <p className='title'>Expectation: </p>
                                            <p>{err.dataPath} {err.message}</p>
                                        </div>
                                        <div className='line'>
                                            <p className='title'>Reality: </p>
                                            <pre dangerouslySetInnerHTML={{ __html: jsonBeautify(JSON.stringify(err.data, null, 4)) }} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </section> : null
            }
        </div>
    )
}