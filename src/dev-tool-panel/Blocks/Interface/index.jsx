import React, { useEffect, useState } from 'react'
import storage from '../../utils/storage'
import { getInterfaceDetail } from '../../utils/fetch'
import './index.css'

export default ({ }) => {
    const [id, setId] = useState('')
    const [list, setList] = useState([])

    const onAdd = () => {
        if (!id) return
        const idList = id.split(',').filter(x => !list.includes(x))
        Promise.all(idList.map(getInterfaceDetail))
            .then(res => res.map(x => ({ iid: x.id, pid: x.projectId, name: x.name, path: x.path, realname: x.creator.realname, method: x.method })))
            .then(x => { setList([...list, ...x]); return [...list, ...x] })
            .then(all => storage.set({ interfacelist: all }))
        // 有个根据ids批量查询nei的接口
    }

    const changeStatus = (item) => {
        const newList = list.map(x => x.iid !== item.iid ? x : { ...x, disabled: !x.disabled })
        setList(newList)
        storage.set({ interfacelist: newList })
    }

    const deleteItem = item => {
        const newList = list.filter(x => x.iid !== item.iid)
        setList(newList)
        storage.set({ interfacelist: newList })
    }

    useEffect(() => {
        storage.get('interfacelist').then((x = []) => setList(x))
    }, [])

    return (
        <div className='block'>
            <div className='interface-add'>
                <input placeholder='Add api id or Split multiple api ids with commas' className='input-add' value={id} onChange={e => setId(e.target.value)} />
                <p className='btn-add' onClick={onAdd}>Add</p>
            </div>

            <section className='interface-list table'>
                <div className="table-hd">
                    <div className="table-row-cell">ID</div>
                    <div className="table-row-cell">Path</div>
                    <div className="table-row-cell">Method</div>
                    <div className="table-row-cell">Desc</div>
                    <div className="table-row-cell">Creator</div>
                    <div className="table-row-cell">Status</div>
                    <div className="table-row-cell">Action</div>
                </div>
                <div className="table-body">
                    {
                        list.map(item => (
                            <div className='table-row' key={item.iid}>
                                <div className="table-row-cell">{item.iid}</div>
                                <div className="table-row-cell">{item.path}</div>
                                <div className="table-row-cell">{item.method}</div>
                                <div className="table-row-cell">{item.name}</div>
                                <div className="table-row-cell">{item.realname}</div>
                                <div className="table-row-cell">
                                    <p className={`status ${item.disabled ? 'status-disable' : 'status-enable'}`}>
                                        {item.disabled ? 'disable' : 'enable'}
                                    </p>
                                </div>
                                <div className="table-row-cell">
                                    <p className='btn' onClick={() => deleteItem(item)}>delete</p>
                                    <p className='btn' onClick={() => changeStatus(item)}>
                                        {item.disabled ? 'enable' : 'disable'}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}