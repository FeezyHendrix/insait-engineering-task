FROM node:22-alpine3.21 AS build

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .

RUN npm run prisma:generate 

RUN npm run build 

FROM node:22-alpine3.21 AS production

ARG VERSION='latest'

LABEL version="${VERSION}"

ENV INSAIT_BE_RELEASE_VERSION=$VERSION


# Install dependencies only when needed
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

WORKDIR /app
RUN  apk update &&  apk add --no-cache curl
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json
COPY --from=build /app/dist/ /app/src/
COPY --from=build /app/src/prisma /app/src/prisma

RUN npm ci --omit=dev

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm run prisma:generate 

EXPOSE 5050

CMD [ "npm", "start" ]