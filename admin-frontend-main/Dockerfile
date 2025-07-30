FROM node:20 AS builder

ARG VERSION='latest'
ENV VITE_RELEASE_VERSION=$VERSION

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM nginx:1.27-alpine3.20-slim AS runner

ARG VERSION='latest'

LABEL version="${VERSION}"

RUN apk update && apk add --upgrade fontconfig curl

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY public/env-config.js /usr/share/nginx/html

COPY docker-entrypoint.sh /usr/bin/docker-entrypoint.sh

RUN chmod +x /usr/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["sh", "/usr/bin/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]