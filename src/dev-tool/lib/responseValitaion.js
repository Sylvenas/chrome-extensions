import Ajv from 'ajv';
import Either from 'data.either'
import Task from 'data.task'
import { parse, eitherToTask } from '../helper/utils'

const initValidate = s => {
    console.log('##############', s)
    const ajv = new Ajv({
        allErrors: true,
        $data: true,
        verbose: true,
        nullable: true
    });
    const validate = ajv.compile(s);
    return Task.of(validate)
}

const parseBody = body =>
    parse(body)
        .map(x => Either.fromNullable(x.data))
        .chain(eitherToTask)

const main = interfaceInfo => (body, validate) => {
    const valid = validate(body)
    if (valid) return Either.Right({ interfaceInfo })
    return Either.Left({ interfaceInfo, errors: validate.errors })
}

export const makeValidation = response => ({ schema, interfaceInfo }) =>
    Task.of(body => validate => main(interfaceInfo)(body, validate))
        .ap(parseBody(response))
        .ap(initValidate(schema))

export default makeValidation