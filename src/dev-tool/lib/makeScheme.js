const BASIC_TYPES = {
    10001: 'string',
    10002: 'number',
    10003: 'boolean',
}

const RESPONSE_OTHERS = ['code', 'message']

function hasChildren(node) {
    return (typeof node === 'object')
        && (typeof node.params !== 'undefined')
        && (node.params.length > 0);
}

const getInterfaceResponseTypes = (interfaceDetail) => {
    const response = interfaceDetail.params.outputs
    const responseTypes = response
        .filter(x => !RESPONSE_OTHERS.includes(x.name))
        .map(x => x.type)

    return responseTypes
}

const getModel = projectDataTypes => id =>
    projectDataTypes.filter(x => x.id === id)[0]

const makeSchema = ({ interfaceDetail, projectDataTypes }) => {
    console.log(interfaceDetail, projectDataTypes)
    const responseTypes = getInterfaceResponseTypes(interfaceDetail) // [457906]
    const getModelById = getModel(projectDataTypes)
    const { projectId, id, name, path, creator: { realname } } = interfaceDetail

    const findIds = (type, tree) => {
        tree = typeof tree !== 'undefined' ? tree : {};
        const model = getModelById(type)
        if (hasChildren(model)) {
            const properties = model.params.reduce((acc, x) => Object.assign(acc, { [x.name]: { ...x, nullable: x.required ? false : true } }), {})
            if (tree.isArray) {
                tree.type = 'array'
                delete tree.required
                tree.items = {
                    type: 'object',
                    properties,
                    required: model.params.filter(x => x.required).map(x => x.name)
                }
                model.params.map(x => findIds(x.type, tree.items.properties[x.name]))
                return
            } else {
                tree.type = 'object'
                tree.properties = properties
                tree.required = model.params.filter(x => x.required).map(x => x.name)
            }
            model.params.map(x => findIds(x.type, tree.properties[x.name]))
        } else {
            if (!tree.required) {
                tree.nullable = true
            }
            delete tree.required
            if (tree.isArray) {
                tree.type = 'array'
                tree.items = {
                    type: BASIC_TYPES[model.id],
                }
            } else {
                tree.type = BASIC_TYPES[model.id]
            }
        }

        return tree
    }
    return {
        schema: responseTypes.map(x => findIds(x))[0],
        interfaceInfo: {
            projectId, id, name, path, realname
        }
    }
}

export default makeSchema