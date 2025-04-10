FROM node:20-alpine

# Set working directory as app 
WORKDIR /app


COPY ./package*.json .

COPY ./* .

RUN npm install

# local port which you want to expose
EXPOSE 5173

# command to run when container starts
CMD [ "npm", "run", "dev" ]
