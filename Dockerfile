FROM node:alpine as builder
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY  --from=builder /app/nginx.conf /etc/nginx/nginx.conf
COPY  --from=builder /app/dist/ /usr/share/nginx/html