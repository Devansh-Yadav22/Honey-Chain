# Blockchain — Honey Chain

Hyperledger Fabric network and chaincode for permissioned honey provenance.

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
│   └── enroll-admin.sh       # Admin identity enrollment
└── README.md
```

## Chaincode Functions

| Function | Description |
|---|---|
| `registerHive()` | Register a new hive on-chain |
| `createHarvest()` | Record a harvest event |
| `createBatch()` | Create a honey batch |
| `addProcessingEvent()` | Record processing step |
| `addTransportEvent()` | Record transport step |
| `addPackagingEvent()` | Record packaging step |
| `getBatch()` | Query batch state |
| `getBatchHistory()` | Get full provenance history |
| `verifyBatch()` | Verify recorded provenance |

## Ledger Assets

Beekeeper, Hive, Harvest, Batch, ProcessingEvent, TransportEvent, PackagingEvent, Certification
