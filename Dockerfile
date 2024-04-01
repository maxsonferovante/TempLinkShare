FROM node:20-slim


# Create app directory
WORKDIR /app

# Instale o OpenSSL
RUN apt-get update -y && apt-get install -y openssl

COPY package.json ./
COPY package-lock.json ./

COPY tsconfig.json ./
COPY ./prisma ./prisma
COPY .env ./

COPY . .

RUN npm install
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
