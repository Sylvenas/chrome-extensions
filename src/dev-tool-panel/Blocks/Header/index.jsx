import React from 'react'

import './index.css'

const NAV_LIST = [
    // 'Project',
    'Interface',
    'Result',
    'Setting'
]

export default ({ activeTab, setActiveTab }) => {

    const renderItem = (item, idx) => (
        <div
            onClick={() => setActiveTab(idx)}
            className={`nav-item ${idx === activeTab ? 'nav-avtive' : ''}`}
            key={item}
        >
            <p>{item}</p>
        </div>
    )

    return (
        <nav className='g-header'>
            {NAV_LIST.map(renderItem)}
        </nav>
    )
}