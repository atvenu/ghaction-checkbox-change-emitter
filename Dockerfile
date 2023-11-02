FROM  node:20.9

WORKDIR /app

RUN npm i -g @vercel/ncc nodemon

COPY package* .
RUN npm install

ENTRYPOINT [ "" ]
