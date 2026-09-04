#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
source ./env.sh

require_command docker
require_command cryptogen
require_command configtxgen
require_command osnadmin
require_command peer

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

CHANNEL_BLOCK="../network/channel-artifacts/${CHANNEL_NAME}.block"
ORDERER_ADMIN_CA="../network/organizations/ordererOrganizations/honeychain.local/orderers/orderer.honeychain.local/tls/ca.crt"
ORDERER_ADMIN_CERT="../network/organizations/ordererOrganizations/honeychain.local/orderers/orderer.honeychain.local/tls/server.crt"
ORDERER_ADMIN_KEY="../network/organizations/ordererOrganizations/honeychain.local/orderers/orderer.honeychain.local/tls/server.key"

echo "Joining ${CHANNEL_NAME} on the orderer..."
joined=false
for attempt in $(seq 1 30); do
  if osnadmin channel join \
    --channelID "${CHANNEL_NAME}" \
    --config-block "${CHANNEL_BLOCK}" \
    -o localhost:7053 \
    --ca-file "${ORDERER_ADMIN_CA}" \
    --client-cert "${ORDERER_ADMIN_CERT}" \
    --client-key "${ORDERER_ADMIN_KEY}"; then
    joined=true
    break
  fi

  echo "Orderer admin API is not ready yet (attempt ${attempt}/30)."
  sleep 2
done

if [ "$joined" != true ]; then
  echo "Unable to join ${CHANNEL_NAME} on the orderer." >&2
  exit 1
fi

echo "Joining ${CHANNEL_NAME} on the peer..."
peer_joined=false
for attempt in $(seq 1 30); do
  if peer channel list 2>/dev/null | grep -q "${CHANNEL_NAME}"; then
    peer_joined=true
    break
  fi

  if peer channel join -b "${CHANNEL_BLOCK}"; then
    peer_joined=true
    break
  fi

  echo "Peer is not ready yet (attempt ${attempt}/30)."
  sleep 2
done

if [ "$peer_joined" != true ]; then
  echo "Unable to join ${CHANNEL_NAME} on the peer." >&2
  exit 1
fi

cat <<EOF
Network containers are starting.

Next:
  1. Wait until peer/orderer containers are healthy.
  2. Run ./deploy-chaincode.sh
EOF
