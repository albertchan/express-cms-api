export const schema = {
  id: { type: 'increments', nullable: false, primary: true },
  version: { type: 'string', nullable: false },
  created_at: { type: 'dateTime', nullable: false }
};
