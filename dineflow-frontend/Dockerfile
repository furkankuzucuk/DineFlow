
FROM node:20-alpine

WORKDIR /app


COPY package.json package-lock.json ./


RUN npm install
RUN npm install -D tailwindcss@3.4.17 postcss autoprefixer


COPY . .


ENV HOST=0.0.0.0


CMD ["npm", "run", "dev", "--", "--host"]