FROM node:lts as dependencies
WORKDIR /deel
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /deel
COPY . .
COPY --from=dependencies /deel/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /deel
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /deel/next.config.js ./
COPY --from=builder /deel/public ./public
COPY --from=builder /deel/.next ./.next
COPY --from=builder /deel/node_modules ./node_modules
COPY --from=builder /deel/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]
