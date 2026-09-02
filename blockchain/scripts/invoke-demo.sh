#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
source ./env.sh

function invoke() {
  peer chaincode invoke \
    -o "${ORDERER_HOST}:${ORDERER_PORT}" \
    --ordererTLSHostnameOverride "$ORDERER_HOST" \
    --tls \
    --cafile "$ORDERER_CA" \
    -C "$CHANNEL_NAME" \
    -n "$CHAINCODE_NAME" \
    --peerAddresses "$CORE_PEER_ADDRESS" \
    --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE" \
    -c "$1"
}

function query() {
  peer chaincode query -C "$CHANNEL_NAME" -n "$CHAINCODE_NAME" -c "$1"
}

invoke '{"function":"registerHive","Args":["{\"hiveId\":\"HIVE-001\",\"beekeeperId\":\"BK-001\",\"location\":{\"lat\":28.6139,\"lng\":77.209,\"state\":\"Delhi\",\"country\":\"India\"},\"installationDate\":\"2026-09-01\",\"status\":\"NORMAL\"}"]}' || true
invoke '{"function":"createHarvest","Args":["{\"harvestId\":\"HARVEST-2026-0001\",\"hiveId\":\"HIVE-001\",\"quantity\":18,\"harvestDate\":\"2026-09-02T18:30:00Z\",\"evidenceRef\":\"iot-summary:HIVE-001:2026-09-02\"}"]}'
invoke '{"function":"createBatch","Args":["{\"batchId\":\"HC-2026-0001\",\"harvestId\":\"HARVEST-2026-0001\"}"]}'
invoke '{"function":"addProcessingEvent","Args":["HC-2026-0001","{\"processorId\":\"PROC-001\",\"eventType\":\"FILTERING\",\"details\":{\"facility\":\"Bee-Tech Processing Unit\"}}"]}'
invoke '{"function":"addTransportEvent","Args":["HC-2026-0001","{\"transporterId\":\"TRANS-001\",\"source\":\"Bee-Tech Processing Unit\",\"destination\":\"Packaging Center Delhi\"}"]}'
invoke '{"function":"addPackagingEvent","Args":["HC-2026-0001","{\"packagerId\":\"PACK-001\",\"productId\":\"JAR-HC-2026-0001\"}"]}'
invoke '{"function":"verifyBatch","Args":["HC-2026-0001"]}'

echo "Batch state:"
query '{"function":"getBatch","Args":["HC-2026-0001"]}'
