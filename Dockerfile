FROM node:16
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm ci
RUN npm run build

FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE $PORT
CMD [ "npm", "run", "start-server" ]