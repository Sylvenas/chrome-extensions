const URL_BASE = 'https://nei.hz.netease.com'

/**
 * 查询项目基本信息
 */
export const getProjectInfo = (pid) => {
  const url = `${URL_BASE}/api/projects/${pid}`
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) { return res.result }
      return Promise.reject(res)
    })
}

/**
 * 查询项目的dataTypes
 * 生成pid <-> dataType 索引
 * 放入缓存，等校验参数的时候取出来，拼接json schema
 */
export const getProjectDataTypes = (pid) => {
  return fetch(`${URL_BASE}/api/datatypes/?pid=${pid}`)
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) { return res.result }
      return Promise.reject(res)
    })
}

/**
 * 查询项目下的所有interface
 * 生成path - interfaceid的索引
 */
export const getProjectInterfaces = (pid) => {
  const url = `${URL_BASE}/api/interfaces/?pid=${pid}`
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) { return res.result }
      return Promise.reject(res)
    })
}

/**
 * 查询具体的interface 信息
 * 获取response的数据结构
 * 然后 + pid <-> dataTypes 生成最终的json schema
 */
export const getInterfaceDetail = (iid) => {
  const url = `${URL_BASE}/api/interfaces/${iid}`
  return fetch(url)
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) { return res.result }
      return Promise.reject(res)
    })
}

