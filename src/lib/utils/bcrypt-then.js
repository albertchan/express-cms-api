import bcrypt from 'bcryptjs';
import Promise from 'bluebird';

export function bcryptCompare(expected, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(expected, hash, function (err, res) {
      if (err) return reject(err)
      resolve(res)
    });
  });
}

export function bcryptHash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    })
  });
}
