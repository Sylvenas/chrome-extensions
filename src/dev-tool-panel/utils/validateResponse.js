import { either, taskEither } from "fp-ts";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import { task } from "fp-ts/lib/Task";
import Ajv from 'ajv';

export const makeValidation = schema => response => {
  const ajv = new Ajv({
    allErrors: true,
    logger: {
      log: c => console.log(c),
      warn: w => console.warn(w),
      error: e => console.error(e),
    }
  });
  const validate = ajv.compile(schema);
  const valid = validate(response)

  if (valid) return either.right(response);

  console.log('----------- response validation errors -----------')
  console.log(validate.errors)
  console.log('----------- response validation errors -----------')
  return either.left(validate.errors)

  // return valid
  //   ? either.right(response)
  //   : either.left(validate.errors)
};

export const APIRequestWithValidation = schema => makeApiRequest => requestArgs =>
  pipe(
    taskEither.tryCatch(() => makeApiRequest(requestArgs), either.toError),
    taskEither.chain(flow(makeValidation(schema), taskEither.fromEither)),
    taskEither.getOrElse(e => task.of(null))
  )();

export default APIRequestWithValidation