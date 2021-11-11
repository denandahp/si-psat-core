FROM node:alpine

RUN apk update 

RUN mkdir /app
#ADD . /app
WORKDIR /app
COPY . /app
COPY package*.json .
# Bundle app source


# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.6.0/wait /wait
# RUN chmod +x /wait

RUN npm install
# CMD /wait && npm start
CMD npm start
