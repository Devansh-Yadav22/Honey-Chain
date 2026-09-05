#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && (pwd -W 2>/dev/null || pwd))"
BLOCKCHAIN_DIR="$(cd "$SCRIPT_DIR/.." && (pwd -W 2>/dev/null || pwd))"
export PATH="$BLOCKCHAIN_DIR/tools/bin:$PATH"

export CHANNEL_NAME="${CHANNEL_NAME:-honeychannel}"
export CHAINCODE_NAME="${CHAINCODE_NAME:-honeychain}"
export CHAINCODE_LABEL="${CHAINCODE_LABEL:-honeychain_1}"
export CHAINCODE_VERSION="${CHAINCODE_VERSION:-1.0}"
export CHAINCODE_SEQUENCE="${CHAINCODE_SEQUENCE:-1}"
export CHAINCODE_LANG="${CHAINCODE_LANG:-node}"
export CHAINCODE_PATH="${CHAINCODE_PATH:-$BLOCKCHAIN_DIR/chaincode/honeychain-cc}"
export ORDERER_HOST="${ORDERER_HOST:-orderer.honeychain.local}"
export ORDERER_PORT="${ORDERER_PORT:-7050}"
export ORDERER_CA="${ORDERER_CA:-$BLOCKCHAIN_DIR/network/organizations/ordererOrganizations/honeychain.local/orderers/orderer.honeychain.local/msp/tlscacerts/tlsca.honeychain.local-cert.pem}"
export CORE_PEER_LOCALMSPID="${CORE_PEER_LOCALMSPID:-Org1MSP}"
export CORE_PEER_ADDRESS="${CORE_PEER_ADDRESS:-localhost:7051}"
export CORE_PEER_TLS_ENABLED="${CORE_PEER_TLS_ENABLED:-true}"
export CORE_PEER_TLS_ROOTCERT_FILE="${CORE_PEER_TLS_ROOTCERT_FILE:-$BLOCKCHAIN_DIR/network/organizations/peerOrganizations/org1.honeychain.local/peers/peer0.org1.honeychain.local/tls/ca.crt}"
export CORE_PEER_MSPCONFIGPATH="${CORE_PEER_MSPCONFIGPATH:-$BLOCKCHAIN_DIR/network/organizations/peerOrganizations/org1.honeychain.local/users/Admin@org1.honeychain.local/msp}"

export FABRIC_CFG_PATH="${FABRIC_CFG_PATH:-$BLOCKCHAIN_DIR/tools/config}"

function require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}
