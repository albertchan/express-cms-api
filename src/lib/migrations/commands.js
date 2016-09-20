import _each from 'lodash/forEach';
import _keys from 'lodash/keys';
import db from '../db';
import { schema } from '../../models';

function addTableColumn(tableName, table, columnName) {
  const columnSpec = schema[tableName][columnName];
  let column;

  // creation distinguishes between text with fieldtype, string with maxlength and all others
  if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
    column = table[columnSpec.type](columnName, columnSpec.fieldtype);
  } else if (columnSpec.type === 'string' && columnSpec.hasOwnProperty('maxlength')) {
    column = table[columnSpec.type](columnName, columnSpec.maxlength);
  } else if (columnSpec.type === 'timestamps') {
    column = table.timestamps();
    return;
  } else {
    column = table[columnSpec.type](columnName);
  }

  if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
    column.nullable();
  } else {
    column.notNullable();
  }

  if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
    column.primary();
  }

  if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
    column.unique();
  }

  if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
    column.unsigned();
  }

  if (columnSpec.hasOwnProperty('references')) {
    // check if table exists?
    column.references(columnSpec.references);
  }

  if (columnSpec.hasOwnProperty('defaultTo')) {
    column.defaultTo(columnSpec.defaultTo);
  }
}

function addColumn(tableName, column, transaction) {
  // chooses table and modifies the table, see http://knexjs.org/#Schema-table
  return (transaction || db).schema.table(tableName, function (table) {
      addTableColumn(tableName, table, column);
  });
}

function dropColumn(table, column, transaction) {
  return (transaction || db).schema.table(table, function (table) {
      table.dropColumn(column);
  });
}

function addUnique(table, column, transaction) {
    return (transaction || db).schema.table(table, function (table) {
        table.unique(column);
    });
}

function dropUnique(table, column, transaction) {
    return (transaction || db).schema.table(table, function (table) {
        table.dropUnique(column);
    });
}

export function createTable(table, transaction) {
  // Knex reference http://knexjs.org/#Schema-createTableIfNotExists
  return (transaction || db).schema.createTableIfNotExists(table, t => {
    const columnKeys = _keys(schema[table]);
    _each(columnKeys, column => addTableColumn(table, t, column));
  });
}
