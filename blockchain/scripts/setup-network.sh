#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
source ./env.sh

require_command docker
require_command cryptogen
require_command configtxgen

mkdir -p ../network/channel-artifacts

if [ ! -d ../network/organizations ]; then
  echo "Generating Fabric crypto material..."
  cryptogen generate --config=../network/crypto-config.yaml --output=../network/organizations
else
  echo "Fabric crypto material already exists. Skipping cryptogen."
fi

echo "Generating channel genesis block for ${CHANNEL_NAME}..."
configtxgen \
  -profile HoneyChainChannel \
  -outputBlock "../network/channel-artifacts/${CHANNEL_NAME}.block" \
  -channelID "${CHANNEL_NAME}" \
  -configPath ../network

echo "Starting Honey Chain Fabric containers..."
docker compose -f ../network/docker-compose.yaml up -d

cat <<EOF
Network containers are starting.

Next:
  1. Wait until peer/orderer containers are healthy.
  2. Join the application channel if your Fabric CLI supports channel participation:
     osnadmin channel join --channelID ${CHANNEL_NAME} --config-block ../network/channel-artifacts/${CHANNEL_NAME}.block -o localhost:7053 --ca-file ${ORDERER_CA} --client-cert ../network/organizations/ordererOrganizations/honeychain.local/orderers/orderer.honeychain.local/tls/server.crt --client-key ../network/organizations/ordererOrganizations/honeychain.local/orderers/orderer.honeychain.local/tls/server.key
  3. Run ./deploy-chaincode.sh
EOF
