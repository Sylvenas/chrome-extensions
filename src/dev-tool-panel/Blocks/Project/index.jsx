import React, { useEffect, useState } from 'react'
import storage from '../../utils/storage'
import { getProjectInfo, getProjectInterfaces } from '../../utils/fetch'
import './index.css'

export default ({ }) => {
  const [projectList, setProjectList] = useState([])
  const [id, setId] = useState('')

  useEffect(() => {
    storage.get('projects', []).then((x = []) => { setProjectList(x) })
  }, [])

  const getProjectInfoFun = id => getProjectInfo(id)
    .then(projectInfo => {
      if (projectInfo) {
        const list = [
          ...projectList,
          { id: projectInfo.id, name: projectInfo.name, lob: projectInfo.lob, status: 1 }]

        setProjectList(list)
        storage.set({ projects: list })
      }
    })

  const onAdd = () => {
    storage.get('projects')
      .then((projects = []) => projects.map(x => x.id))
      .then(pids => pids.includes(id))
      .then(hasAdd => !hasAdd && getProjectInfoFun(id))
  }

  console.log(projectList)
  return (
    <div className='block'>
      <div className='project-add'>
        <input placeholder='Add project' className='input-add' value={id} onChange={e => setId(e.target.value)} />
        <p className='btn-add' onClick={onAdd}>Add</p>
      </div>
      <section className='project-list'>
        {
          projectList.map(({ status, name, id }) => (
            <div className='project-item'>
              <div className='line'>
                <p>Status</p>
                <p className='status status-enable'>{status ? 'enabled' : 'disabled'}</p>
              </div>
              <div className='line'>
                <p>Description</p>
                <p>{name}({id})</p>
              </div>
              <div className='line'>
                <p>Action</p>
                <div className='line'>
                  <p className='btn'>delete</p>
                  <p className='btn'>disable</p>
                </div>
              </div>
            </div>
          ))
        }
      </section>
    </div>
  )
}