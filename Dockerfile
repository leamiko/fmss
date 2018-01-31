FROM nginx:1.12
MAINTAINER suyuanyang <535297715@qq.com>
COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist/  /usr/share/nginx/html/