import React from 'react'
import storage from '../../utils/storage'
import './index.css'

export default ({ }) => {
    const clearData = key => storage
        .clear(key)
        .then(() => console.log(`${key} cleared`))
    return (
        <div className='block'>
            <div className='line'>
                <p>Allow null：</p>
                <input type='checkbox' />
            </div>
            {/* <div className='line'>
                <p>Clear all Project Ids：</p>
                <p className='btn' onClick={() => clearData('projects')}>Clear</p>
            </div> */}
            <div className='line'>
                <p>Clear all Interface Ids：</p>
                <p className='btn' onClick={() => clearData('interfacelist')}>Clear</p>
            </div>
            <div className='line'>
                <p>Clear all Result Ids：</p>
                <p className='btn' onClick={() => clearData(['errorList', 'successList'])}>Clear</p>
            </div>
        </div>
    )
}