FROM  node:24

WORKDIR /app

RUN npm i -g @vercel/ncc nodemon

COPY package* .
RUN npm install

ENTRYPOINT [ "" ]
