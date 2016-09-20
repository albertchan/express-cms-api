#!/bin/sh

npm run start-prod &
nginx -g 'daemon off;'
