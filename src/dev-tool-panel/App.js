import React, { useState, useEffect } from 'react';
import RenderIf from './components/render-if'
import Header from './Blocks/Header'
import Project from './Blocks/Project'
import Interface from './Blocks/Interface'
import Result from './Blocks/Result'
import Action from './Blocks/Action'

import storage from './utils/storage'
import {
    getProjectInterfaces,
    getProjectDataTypes
} from './utils/fetch'
import './App.less'



function App() {
    const [activeTab, setActiveTab] = useState(0)
    const [projectList, setProjectList] = useState([])

    useEffect(() => {
        chrome.storage.onChanged.addListener(function (changes, areaName) {    // eslint-disable-line
            if (changes.errorList || changes.successList) {
                setActiveTab(1)
            }
        })
    }, [])

    // useEffect(() => {
    //     if (!projectList.length) return
    //     Promise.all(projectList.map(({ id }) => getProjectInterfaces(id)))
    //         .then((res) => {
    //             window.res = res
    //             const interfacelist = res
    //                 .reduce((acc, x) => acc.concat(x), [])
    //                 .map(x => ({ path: x.path, iid: x.id, pid: x.projectId, realname: x.creator.realname }))
    //             storage.set({ interfacelist })
    //         })
    // }, [projectList])

    useEffect(() => {
        storage.get('projects', []).then((x = []) => { setProjectList(x) })
    }, [])

    return (
        <div className="App">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* <RenderIf condition={activeTab == 0}><Project /></RenderIf> */}
            <RenderIf condition={activeTab == 0}><Interface /></RenderIf>
            <RenderIf condition={activeTab == 1}><Result /></RenderIf>
            <RenderIf condition={activeTab == 2}><Action /></RenderIf>
        </div>
    );
}

export default App;
