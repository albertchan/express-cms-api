import express from 'express';
import apiMiddlewares from './v1/middlewares';
import apiAuth from './v1/auth';
import apiPosts from './v1/posts';
import apiProfiles from './v1/profile';
import apiUsers from './v1/users';

export default (server) => {
  server.use('/api/v1', apiMiddlewares);
  server.use('/api/v1', [apiAuth, apiPosts, apiUsers, apiProfiles]);
}
