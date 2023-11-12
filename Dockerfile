FROM node:18


# Create app directory
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY tsconfig.json ./
COPY ./prisma ./prisma
COPY .env ./

COPY . .

RUN npm install
RUN npx prisma generate


EXPOSE 3000

CMD [ "npm", "run", "dev:migrate" ]
