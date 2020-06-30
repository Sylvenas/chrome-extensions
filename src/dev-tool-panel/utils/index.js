export const getType = obj =>
    Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase()

export const dataToString = data => {
    const type = getType(data)
    let str = ''
    switch (type) {
        case 'null':
            str = 'null'
            break;
        case 'undefined':
            str = 'undefined'
            break;
        case 'array':
            str = 'array'
            break;
        case 'object':
            str = JSON.stringify(data)
            break;
        default:
            str = data
            break;
    }

    return str
}
