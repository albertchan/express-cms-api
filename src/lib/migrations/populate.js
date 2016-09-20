import Promise from 'bluebird';
import { createTable } from './commands';
import { schema } from '../../models';

const schemaTables = Object.keys(schema);

/*
 * populate
 *
 * Uses the specified schema to determine table structures and creates each
 * table in order. This method is used to create a brand new database for a
 * new installation of the CMS
 *
 */
export default function populate(options) {
  options = options || {};

  const tablesOnly = options.tablesOnly;
  const tableSequence = Promise.mapSeries(schemaTables, table => {
    console.log('Creating table:', table);
    return createTable(table);
  });

  if (tablesOnly) return tableSequence;

  return tableSequence.then(() => {
    console.log('TODO: seed database');
    return false;
  });
}
