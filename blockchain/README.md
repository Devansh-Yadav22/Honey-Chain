# Blockchain - Honey Chain

Hyperledger Fabric network and chaincode for permissioned honey provenance.

This folder follows the blockchain decisions in `00_MASTER_SPEC.md`:

- Hyperledger Fabric is the permissioned trust layer.
- Raw telemetry stays off-chain.
- The ledger records provenance, custody events, timestamps, actor references, quantities, and evidence references.
- Blockchain verification confirms recorded ledger state and chain-of-custody completeness. It does not prove physical honey purity.

## Structure

```
blockchain/
├── network/
│   ├── docker-compose.yaml   # Fabric peer/orderer/CA containers
│   ├── configtx.yaml         # Channel configuration
│   ├── crypto-config.yaml    # Crypto material generation config
│   └── connection-org1.json  # Connection profile
├── chaincode/
│   └── honeychain-cc/
│       ├── src/
│       │   └── index.ts      # Chaincode entry point
│       ├── package.json
│       └── tsconfig.json
├── wallet/                   # Identity wallet (gitignored)
├── scripts/
│   ├── setup-network.sh      # Network bootstrap script
│   ├── deploy-chaincode.sh   # Chaincode deployment
│   ├── enroll-admin.sh       # Admin identity notes
│   ├── env.sh                # Shared script configuration
│   └── invoke-demo.sh        # Blockchain-only demo flow
└── README.md
```

## Network

The Phase 1 development network is intentionally small:

| Component | Purpose |
|---|---|
| `Org1MSP` | Prototype consortium organization |
| `peer0.org1.honeychain.local` | Endorsing peer and ledger host |
| `OrdererMSP` | Ordering service organization |
| `orderer.honeychain.local` | Single-node development orderer |
| `honeychannel` | Application channel |
| `honeychain` | Chaincode name |

Generated crypto material and channel artifacts are ignored by Git.

## Chaincode Functions

| Function | Description |
|---|---|
| `initLedger()` | Seed a demo hive for development |
| `registerHive(hiveJson)` | Register a new hive on-chain |
| `createHarvest(harvestJson)` | Record a harvest event from an existing hive |
| `createBatch(batchJson)` | Create a honey batch from an existing harvest |
| `addEvent(batchId, eventJson)` | Generic provenance event entry point |
| `addProcessingEvent(batchId, eventJson)` | Record processing step |
| `addTransportEvent(batchId, eventJson)` | Record transport step |
| `addPackagingEvent(batchId, eventJson)` | Record packaging step |
| `getBatch(batchId)` | Query current batch state |
| `getBatchHistory(batchId)` | Query Fabric key history for a batch |
| `verifyBatch(batchId)` | Verify ledger provenance completeness |
| `assetExists(key)` | Utility query for integration/debugging |

## Ledger Assets

Implemented on-chain assets:

- `Hive`
- `Harvest`
- `Batch`
- `ProcessingEvent`
- `TransportEvent`
- `PackagingEvent`
- Certification-ready generic events via `addEvent`

The batch document embeds provenance events so `getBatch` gives the current passport-ready chain of custody. Fabric history remains available through `getBatchHistory`.

## Batch ID Contract

`createBatch` enforces the master-spec format:

```text
HC-YYYY-NNNN
```

Example:

```text
HC-2026-0001
```

## Example Payloads

Register a hive:

```json
{
  "hiveId": "HIVE-001",
  "beekeeperId": "BK-001",
  "location": {
    "lat": 28.6139,
    "lng": 77.209,
    "state": "Delhi",
    "country": "India"
  },
  "installationDate": "2026-09-01",
  "status": "NORMAL"
}
```

Create a harvest:

```json
{
  "harvestId": "HARVEST-2026-0001",
  "hiveId": "HIVE-001",
  "quantity": 18,
  "harvestDate": "2026-09-02T18:30:00Z",
  "evidenceRef": "iot-summary:HIVE-001:2026-09-02"
}
```

Create a batch:

```json
{
  "batchId": "HC-2026-0001",
  "harvestId": "HARVEST-2026-0001"
}
```

## Local Build

From `blockchain/chaincode/honeychain-cc`:

```bash
npm install
npm run build
```

## Development Flow

From `blockchain/scripts`:

```bash
./setup-network.sh
./deploy-chaincode.sh
./invoke-demo.sh
```

The scripts expect Hyperledger Fabric CLI binaries (`cryptogen`, `configtxgen`, `peer`) and Docker to be available in `PATH`.

## Backend Integration Notes

The future backend Fabric gateway should use:

| Value | Default |
|---|---|
| Channel | `honeychannel` |
| Chaincode | `honeychain` |
| MSP ID | `Org1MSP` |
| Connection profile | `blockchain/network/connection-org1.json` |

The frontend should never call Fabric directly. It should call backend REST APIs, and the backend should invoke this chaincode through a service abstraction.
