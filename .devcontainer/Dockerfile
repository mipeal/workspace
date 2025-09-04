FROM node:20-slim

# Install basic tools in one layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git curl wget gnupg lsb-release ca-certificates bash vim procps sudo \
    openssh-client openssh-server && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install -g npm@latest

RUN npm install -g eslint

WORKDIR /workspace
# Healthcheck for node
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s CMD node -v || exit 1