import Promise from 'bluebird';
import validator from 'validator';

export function validateSchema(tableName, model) {
  let validationErrors = [];

  if (validationErrors.length > 0) {
    return Promise.reject(validationErrors);
  }

  return Promise.resolve();
}
