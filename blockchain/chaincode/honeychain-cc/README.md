# Honey Chain Chaincode

TypeScript Hyperledger Fabric contract for Phase 1 honey provenance.

## Contract

The exported contract is `HoneyChainContract`.

Functions exposed to the backend service layer:

- `registerHive(hiveJson)`
- `createHarvest(harvestJson)`
- `createBatch(batchJson)`
- `addEvent(batchId, eventJson)`
- `addProcessingEvent(batchId, eventJson)`
- `addTransportEvent(batchId, eventJson)`
- `addPackagingEvent(batchId, eventJson)`
- `getBatch(batchId)`
- `getBatchHistory(batchId)`
- `verifyBatch(batchId)`

## Important Boundary

`verifyBatch` verifies recorded ledger provenance and required chain-of-custody events. It does not prove physical honey purity or absence of adulteration. Quality evidence and AI consistency checks remain off-chain or in the backend/AI layers per `00_MASTER_SPEC.md`.

## Build

```bash
npm install
npm run build
```

## Example Arguments

```json
{
  "hiveId": "HIVE-001",
  "beekeeperId": "BK-001",
  "location": {
    "lat": 28.6139,
    "lng": 77.209
  },
  "installationDate": "2026-09-01",
  "status": "NORMAL"
}
```
