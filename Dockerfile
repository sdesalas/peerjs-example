FROM node:20-slim
WORKDIR /var/task
COPY . /var/task
RUN npm install
CMD ["npm", "start"]
