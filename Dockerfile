FROM node:18


# Create app directory
WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

COPY tsconfig.json ./
COPY ./prisma ./prisma
COPY .env ./

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
