#!/bin/bash
docker compose build
docker run -v .:/app -it node-dev npm run build