#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
source ./env.sh

require_command npm
require_command peer

echo "Building Honey Chain chaincode..."
pushd "$CHAINCODE_PATH" >/dev/null
npm install
npm run build
popd >/dev/null

rm -f "${CHAINCODE_NAME}.tar.gz"

echo "Packaging chaincode ${CHAINCODE_NAME}..."
peer lifecycle chaincode package "${CHAINCODE_NAME}.tar.gz" \
  --path "$CHAINCODE_PATH" \
  --lang "$CHAINCODE_LANG" \
  --label "$CHAINCODE_LABEL"

echo "Installing chaincode on ${CORE_PEER_ADDRESS}..."
peer lifecycle chaincode install "${CHAINCODE_NAME}.tar.gz" || true

PACKAGE_ID="$(peer lifecycle chaincode queryinstalled | sed -n "s/^Package ID: \(${CHAINCODE_LABEL}:[^,]*\), Label: ${CHAINCODE_LABEL}$/\1/p" | head -n 1)"

if [ -z "$PACKAGE_ID" ]; then
  echo "Unable to find installed package ID for ${CHAINCODE_LABEL}" >&2
  exit 1
fi

echo "Approving chaincode definition for Org1MSP..."
peer lifecycle chaincode approveformyorg \
  -o "${ORDERER_HOST}:${ORDERER_PORT}" \
  --ordererTLSHostnameOverride "$ORDERER_HOST" \
  --channelID "$CHANNEL_NAME" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --package-id "$PACKAGE_ID" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --tls \
  --cafile "$ORDERER_CA"

echo "Committing chaincode definition..."
peer lifecycle chaincode commit \
  -o "${ORDERER_HOST}:${ORDERER_PORT}" \
  --ordererTLSHostnameOverride "$ORDERER_HOST" \
  --channelID "$CHANNEL_NAME" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses "$CORE_PEER_ADDRESS" \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE"

echo "Initializing demo ledger seed..."
peer chaincode invoke \
  -o "${ORDERER_HOST}:${ORDERER_PORT}" \
  --ordererTLSHostnameOverride "$ORDERER_HOST" \
  --tls \
  --cafile "$ORDERER_CA" \
  -C "$CHANNEL_NAME" \
  -n "$CHAINCODE_NAME" \
  --peerAddresses "$CORE_PEER_ADDRESS" \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE" \
  -c '{"function":"initLedger","Args":[]}'

echo "Honey Chain chaincode deployed."
