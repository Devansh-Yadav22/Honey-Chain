#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
source ./env.sh

cat <<'EOF'
Admin enrollment depends on the Fabric CA workflow selected by the deployment environment.

For this Phase 1 repository, crypto material is generated with cryptogen by setup-network.sh,
so the Org1 admin MSP is available at:

  blockchain/network/organizations/peerOrganizations/org1.honeychain.local/users/Admin@org1.honeychain.local/msp

Backend gateway clients should use a wallet identity derived from that MSP or a Fabric CA
enrolled application user. Do not commit generated wallet material.
EOF
