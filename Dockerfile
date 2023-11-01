FROM  node:20.9

WORKDIR /app

COPY package* .
RUN npm install

ENTRYPOINT [ "" ]
