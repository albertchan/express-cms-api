FROM alpine:3.4
MAINTAINER Albert C.

RUN apk add --no-cache nginx nodejs tini
RUN mkdir /run/nginx
RUN mkdir -p /var/nginx/cache/cdn && \
    mkdir -p /var/nginx/cache/images && \
    chown -R nginx:nginx /var/nginx/cache

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

COPY build/dist/ /usr/share/nginx/html
COPY nginx/conf.d /etc/nginx/conf.d
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY . /usr/app
WORKDIR /usr/app

EXPOSE 80
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["./start.sh"]
