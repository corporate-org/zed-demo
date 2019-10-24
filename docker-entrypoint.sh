#!/bin/bash

# Add:
# COPY docker-entrypoint.sh ./
# RUN ["chmod", "+x", "./docker-entrypoint.sh"]
# ENTRYPOINT ["./docker-entrypoint.sh"]
# to the Dockerfile


#  Exit immediately if a future command exits with a non-zero status.
set -e

echo "[Entrypoint Script] Initializing Environment."

# Initialize the Database
node ./bin/init_db.js

echo "[Entrypoint Script] Initialization Complete. Running command."

# Run the command defined as CMD
exec "$@"
