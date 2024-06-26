FROM node:alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN yarn set version 4.1.0
# Install app dependencies
RUN npm config set registry https://registry.npm.taobao.org/

RUN yarn cache clean
RUN yarn

COPY . .
RUN yarn set version 4.1.0
RUN yarn run build

FROM node:alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env
COPY --from=builder /app/prisma ./prisma/



EXPOSE 3000
CMD [ "yarn", "run", "start:prod" ]
