FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx hardhat compile

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

EXPOSE 8545

CMD ["sh", "entrypoint.sh"]
