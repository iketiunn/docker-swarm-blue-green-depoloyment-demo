FROM node:12.13.1-alpine3.10
ADD . /code
WORKDIR /code
CMD ["node", "index"]