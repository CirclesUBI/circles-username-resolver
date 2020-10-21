FROM node:12-slim

WORKDIR /usr/src

# Create man folders which are required by postgres
RUN seq 1 8 | xargs -I{} mkdir -p /usr/share/man/man{}

# Install dependencies
RUN apt-get update \
      && apt-get install -y git python build-essential postgresql-client

WORKDIR /usr/src/app

COPY . .

RUN npm install \
      && npm run build

# Remove unneeded dependencies
RUN apt-get purge -y --auto-remove build-essential

EXPOSE 3000

RUN chmod +x scripts/*.sh

ENTRYPOINT ["./scripts/wait-for-db.sh"]