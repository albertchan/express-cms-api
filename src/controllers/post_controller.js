import validator from 'validator';
import error from '../lib/errors';
import { Post } from '../models/post';

export function findPage(req, res) {
  let options = {};

  // apply filters
  if (req.params.type === '@' && req.params.user_id) {
    options = {
      filter: {prop: 'slug', op: '=', value: req.params.user_id}
    };
  }
  if (!req.params.type && req.params.user_id) {
    options = {
      filter: {prop: 'user_id', op: '=', value: req.params.user_id}
    }
  }

  Post.findPage(options).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    console.log(err);
    res.status(400).json({ error: err.message });
  });
}

export function create(req, res) {
  if (!req.session.user) return res.status(401);
  if (!req.body) return res.status(400);

  const changeset = req.body;
  changeset.user_id = req.session.user.id;

  Post.add(changeset).then(result => {
    res.status(200).json(result.toJSON());
  }).catch(err => {
    res.status(400).json({ error: err.message });
  });
}

export function readPostByProfile(req, res) {
  const post_id = req.params.post_id;
  const user_id = req.params.user_id;

  console.log('readPostByProfile', user_id, post_id);

  if (isNaN(post_id) && isNaN(user_id)) {
    return error.badRequest(req, res);
  }
  fetch({ id: post_id, user_id }, res);
}

export function readByID(req, res) {
  const id = req.params.id;

  if (isNaN(id)) {
    return error.badRequest(req, res);
  }
  fetch({ id: id }, res);
}

export function readBySlug(req, res) {
  const id = req.params.id;
  fetch({ slug: id }, res);
}

export function deleteByID(req, res) {
  const id = req.params.id;

  if (isNaN(id)) {
    return error.badRequest(req, res);
  }
  destroy({ id: id }, res);
}

export function deleteBySlug(req, res) {
  const id = req.params.id;
  destroy({ slug: id }, res);
}

export function updateByID(req, res) {
  if (!req.body) return error.badRequest(req, res);
  const id = req.params.id;
  const data = req.body;

  if (isNaN(id)) {
    return error.badRequest(req, res);
  }
  update({ id: id }, data, res);
}

export function updateBySlug(req, res) {
  if (!req.body) return error.badRequest(req, res);
  const id = req.params.id;
  const data = req.body;

  update({slug: id}, data, res);
}

function destroy(idObj, res) {
  Post.forge(idObj).destroy().then(model => {
    res.status(200).json({ success: 'deleted', model });
  }).catch(err => {
    res.status(500).json({ code: 500, error: err.message });
  });
}

function fetch(data, res) {
  Post.findOne(data).then(post => {
    res.status(200).json(post.toJSON());
  }).catch(err => {
    res.status(404).json({ error: err.message });
  });
}

function update(idObj, data, res) {
  Post.update(idObj, data).then(result => {
    const postData = result.toJSON();
    res.status(200).json(postData);
  }).catch(err => {
    res.status(400).json({code: 400, error: err.message});
  });
}
