FROM  node:20.9

WORKDIR /app

RUN npm i -g @vercel/ncc

COPY package* .
RUN npm install

ENTRYPOINT [ "" ]
