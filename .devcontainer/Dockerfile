FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG NODE_VERSION=22

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        curl \
        git \
        gnupg \
        jq \
        libpq-dev \
        postgresql-client \
        redis-tools \
        unzip \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_VERSION}.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g pnpm \
    && rm -rf /var/lib/apt/lists/*

USER vscode

ENV PATH="/home/vscode/.local/bin:${PATH}"

RUN curl -LsSf https://astral.sh/uv/install.sh | sh

WORKDIR /workspace/DARCHIE
